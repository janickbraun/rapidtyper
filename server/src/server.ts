import express, { Application } from "express"
import dotenv from "dotenv"
import helmet from "helmet"
import { Server } from "socket.io"
import cors from "cors"
import bodyParser from "body-parser"
import path from "path"
import jwt from "jsonwebtoken"
import http from "http"
import mongoose from "mongoose"
import Lobby from "../models/Lobby"
import User from "../models/User"
import Text from "../models/Text"
import { unlock } from "./routes/unlockFun"

dotenv.config()

const PORT = process.env.PORT
const allowedOrigins = ["http://localhost", "http://localhost:5000", "https://grovider.co", "https://rapidtyper.com", "http://rapidtyper.com", "http://localhost:3000", "https://flagicons.lipis.dev"]

const app: Application = express()
const server = http.createServer(app)
const io: any = new Server(server, {
    cors: {
        origin: (origin, callback) => {
            if (!origin) return callback(null, true)
            if (allowedOrigins.indexOf(origin) === -1) {
                let msg = "The CORS policy for this site does not " + "allow access from the specified Origin."
                return callback(new Error(msg), false)
            }
            return callback(null, true)
        },
        methods: ["GET", "POST"],
    },
})

mongoose.set("strictQuery", false)
mongoose
    .connect(process.env.MONGO_DB_ADRESS!, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        socketTimeoutMS: 0,
        connectTimeoutMS: 0,
        autoIndex: true,
    } as object)
    .then(() => console.log("Connected to Database"))

mongoose.connection.on("error", (err) => {
    console.log(err)
})

let typists: Array<any> = []

io.on("connection", (socket: any) => {
    socket.on("typing", (data: any) => {
        try {
            socket.broadcast.to(String(data.code)).emit("typing", { username: data.username, completed: data.completed })
        } catch {}
    })

    socket.on("starting", async (data: any) => {
        try {
            await Lobby.findOneAndUpdate(
                { code: data.code },
                {
                    $set: {
                        joinable: false,
                    },
                }
            )
            io.to(String(data.code)).emit("starting")
        } catch {}
    })

    socket.on("start", async (data: any) => {
        try {
            const tempLobby = await Lobby.findOne({ code: data.code })
            if (!tempLobby?.startTime) {
                await Lobby.findOneAndUpdate(
                    { code: data.code },
                    {
                        $set: {
                            startTime: new Date(),
                        },
                    }
                )
            }

            io.to(String(data.code)).emit("start")
        } catch {}
    })

    socket.on("finish", async (data: any) => {
        try {
            console.log("server finsih1")
            const accuracy = data.accuracy
            const username = data.username
            const token = data.token
            const code = data.code

            const now = Number(new Date().getTime())

            const temporaryUser: any = jwt.verify(token, process.env.JWT_SECRET as string)
            const loggedin = await User.exists({ _id: temporaryUser.id })
            const lobby = await Lobby.findOne({ code })
            const user = await User.findOne({ username })
            if (!lobby || !user || !loggedin) return
            const text = await Text.findOne({ _id: lobby.text })
            if (!text) return
            const textLength = text.text.length
            const time = Number(Math.abs((now - Number(lobby.startTime)) / 1000).toFixed(2))
            const wpm = Number((textLength / 5 / (time / 60)).toFixed(2))
            console.log("server finsih2")
            io.sockets.in(String(code)).emit("finish", { username, wpm, time })
            let tempAcc = user.accuracy
            let tempWpm = user.wpm
            if (tempAcc.length >= 10) {
                tempAcc.shift()
                tempWpm.shift()
            }

            let bestSpeed = false

            if (wpm > user.bestRace) {
                bestSpeed = true
            }

            tempAcc.push(accuracy)
            tempWpm.push(wpm)

            if (lobby.finished) {
                if (user.racesTotal === 99) {
                    unlock("dino", user, 0)
                }
                if (bestSpeed) {
                    unlock("wpm", user, wpm)
                    await User.findByIdAndUpdate(user.id, {
                        $set: {
                            racesTotal: user.racesTotal + 1,
                            wpm: tempWpm,
                            accuracy: tempAcc,
                            bestRace: wpm,
                            timeSpentRacing: user.timeSpentRacing + time,
                            lastGame: new Date(),
                        },
                    })
                } else {
                    await User.findByIdAndUpdate(user.id, {
                        $set: {
                            racesTotal: user.racesTotal + 1,
                            wpm: tempWpm,
                            accuracy: tempAcc,
                            timeSpentRacing: user.timeSpentRacing + time,
                            lastGame: new Date(),
                        },
                    })
                }
            } else {
                await Lobby.findByIdAndUpdate(lobby.id, { $set: { finished: true, finishedDate: new Date() } })
                if (accuracy === 100) {
                    unlock("octopus", user, 0)
                }
                if (user.racesWon === 9) {
                    unlock("ape", user, 0)
                }
                if (user.racesWon === 19) {
                    unlock("ape", user, 0)
                }
                if (user.racesTotal === 99) {
                    unlock("dino", user, 0)
                }

                if (bestSpeed) {
                    unlock("wpm", user, wpm)
                    await User.findByIdAndUpdate(user.id, {
                        $set: {
                            racesTotal: user.racesTotal + 1,
                            racesWon: user.racesWon + 1,
                            wpm: tempWpm,
                            accuracy: tempAcc,
                            bestRace: wpm,
                            timeSpentRacing: user.timeSpentRacing + time,
                            lastGame: new Date(),
                        },
                    })
                } else {
                    await User.findByIdAndUpdate(user.id, {
                        $set: {
                            racesTotal: user.racesTotal + 1,
                            racesWon: user.racesWon + 1,
                            wpm: tempWpm,
                            accuracy: tempAcc,
                            timeSpentRacing: user.timeSpentRacing + time,
                            lastGame: new Date(),
                        },
                    })
                }
            }
        } catch {}
    })

    socket.on("join", (data: any) => {
        if (typists.some((e: any) => e.username === data.username)) {
            for (let i = 0; i < typists.length; i++) {
                if (typists[i].username === data.username) {
                    socket.leave(String(typists[i].code))
                    break
                }
            }

            typists = typists.filter((el: any) => {
                return el.username !== data.username
            })
        }

        //if (io.sockets.adapter.rooms.get(data.code)?.size > 2) return
        socket.join(String(data.code))
        if (data.code.length === 4) {
            typists.push({
                id: socket.id,
                username: data.username,
                code: data.code,
            })
            try {
                socket.broadcast.to(String(data.code)).emit("join", { num: io.sockets.adapter.rooms.get(data.code).size })
            } catch {}
        }
    })

    socket.on("disconnect", async () => {
        if (typists.some((e: any) => e.id === socket.id)) {
            for (let i = 0; i < typists.length; i++) {
                if (typists[i].id === socket.id && typists[i].code.length === 4) {
                    try {
                        await Lobby.findOneAndUpdate(
                            { code: typists[i].code },
                            {
                                $pull: {
                                    participants: { username: typists[i].username },
                                },
                            }
                        )
                        socket.leave(String(typists[i].code))
                        if (io.sockets.adapter.rooms.get(String(typists[i].code))) {
                            io.to(String(typists[i].code)).emit("leave", { username: typists[i].username })
                        }
                    } catch (e) {
                        console.log(e)
                    }

                    typists = typists.filter((el: any) => {
                        return el.id !== socket.id
                    })
                    break
                }
            }
        }
        socket.removeAllListeners()
    })

    socket.on("error", function (err: any) {
        if (err.description) throw err.description
        else throw err // Or whatever you want to do
    })
})

app.use(cors())
app.options("*", cors())
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                imgSrc: ["'self'", "https://*.grovider.co", "https://*.lipis.dev", "data:", "*.buymeacoffee.com", "*.paypal.com", "grovider.co"],
            },
        },

        crossOriginResourcePolicy: { policy: "cross-origin" },
        crossOriginEmbedderPolicy: false,
    })
)

app.set("io", io)

import indexRouter from "./routes/index"
import signUpRouter from "./routes/account/signup"
import loginRouter from "./routes/account/login"
import isloggedinRouter from "./routes/account/isloggedin"
import deleteaccountRouter from "./routes/account/delete"
import multiplayerRouter from "./routes/multiplayer"
import playRouter from "./routes/play"
import getTextRouter from "./routes/getText"
import getStatsRouter from "./routes/stats"
import changeUsernameRouter from "./routes/account/changeusername"
import leaderboardRouter from "./routes/leaderboard"
import changeSkinRouter from "./routes/account/changeskin"
import changeCountryRouter from "./routes/account/changecountry"
import unlockSkinRouter from "./routes/unlockSkin"
import forgotRouter from "./routes/account/forgot"
import resetRouter from "./routes/account/reset"
import verifyRouter from "./routes/account/verify"
import verifyAnotherRouter from "./routes/account/sendAnotherVerify"
import changePasswordRouter from "./routes/account/changepassword"
import buyRouter from "./routes/shop/buy"
import buySuccessRouter from "./routes/shop/success"
import adminRouter from "./routes/admin/admin"
import addSkinRouter from "./routes/admin/addSkin"
import getShopRouter from "./routes/shop/getShop"
import feedbackRouter from "./routes/feedback"
import singleplayerRouter from "./routes/singleplayer"
import singleplayerStatsRouter from "./routes/getSingleplayerStats"
import changeEmailRouter from "./routes/account/changeemail"

app.use("/api", indexRouter)
app.use("/api/signup", signUpRouter)
app.use("/api/login", loginRouter)
app.use("/api/isloggedin", isloggedinRouter)
app.use("/api/deleteaccount", deleteaccountRouter)
app.use("/api/multiplayer", multiplayerRouter)
app.use("/api/play", playRouter)
app.use("/api/gettext", getTextRouter)
app.use("/api/getstats", getStatsRouter)
app.use("/api/changeusername", changeUsernameRouter)
app.use("/api/leaderboard", leaderboardRouter)
app.use("/api/changeskin", changeSkinRouter)
app.use("/api/changecountry", changeCountryRouter)
app.use("/api/unlockskin", unlockSkinRouter)
app.use("/api/account/forgot", forgotRouter)
app.use("/api/account/reset", resetRouter)
app.use("/api/account/verify", verifyRouter)
app.use("/api/account/verifyanother", verifyAnotherRouter)
app.use("/api/account/changepassword", changePasswordRouter)
app.use("/api/shop/buy", buyRouter)
app.use("/api/shop/success", buySuccessRouter)
app.use("/api/admin", adminRouter)
app.use("/api/admin/addskin", addSkinRouter)
app.use("/api/shop/getshop", getShopRouter)
app.use("/api/feedback", feedbackRouter)
app.use("/api/singleplayer", singleplayerRouter)
app.use("/api/singleplayer/stats", singleplayerStatsRouter)
app.use("/api/account/changeemail", changeEmailRouter)

const root = path.join(__dirname, "../build")
app.use(express.static(root))
app.use("*", express.static(root))

server.listen(PORT, () => console.log("Server starting on " + process.env.BACKEND_URL))
