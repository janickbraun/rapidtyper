import express, { Application } from "express"
import dotenv from "dotenv"
import helmet from "helmet"
import { Server } from "socket.io"
import cors from "cors"
import bodyParser from "body-parser"
import path from "path"
import http from "http"
import mongoose from "mongoose"

dotenv.config()

const PORT = process.env.PORT
const allowedOrigins = ["http://localhost", "http://localhost:5000", "https://grovider.co"]

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
    } as object)
    .then(() => console.log("Connected to Database"))

mongoose.connection.on("error", (err) => {
    console.log(err)
})

let typists: any = []

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

    socket.on("start", (data: any) => {
        try {
            io.to(String(data.code)).emit("start")
        } catch {}
    })

    socket.on("finish", (data: any) => {
        try {
            io.to(String(data.code)).emit("finish", { username: data.username, wpm: data.wpm })
        } catch {}
    })

    socket.on("join", (data: any) => {
        socket.join(String(data.code))
        if (data.code.length === 4) {
            typists.push({
                id: socket.id,
                code: data.code,
            })
            try {
                socket.broadcast.to(String(data.code)).emit("join", { num: io.sockets.adapter.rooms.get(data.code).size })
                //io.to(String(data.code)).emit("join", { username: data.username, num: io.sockets.adapter.rooms.get(data.code).size })
            } catch {}
        }
    })

    socket.on("disconnect", () => {
        //console.log("disconnect")
        if (typists.some((e: any) => e.id === socket.id)) {
            for (let i = typists.length - 1; i >= 0; i--) {
                if (typists[i].id === socket.id && typists[i].code.length === 4) {
                    try {
                        io.to(String(typists[i].code)).emit("leave", { msg: "someone left", num: io.sockets.adapter.rooms.get(typists[i].code).size })
                    } catch {}

                    typists.splice(i, 1)
                    break
                }
            }
        }
    })

    socket.on("leave", () => {
        //console.log("leave")
    })
})

app.use(cors())
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(helmet())

app.set("io", io)

import indexRouter from "./routes/index"
import signUpRouter from "./routes/account/signup"
import loginRouter from "./routes/account/login"
import isloggedinRouter from "./routes/account/isloggedin"
import deleteaccountRouter from "./routes/account/delete"
import multiplayerRouter from "./routes/multiplayer"
import playRouter from "./routes/play"
import Lobby from "../models/Lobby"

app.use("/api", indexRouter)
app.use("/api/signup", signUpRouter)
app.use("/api/login", loginRouter)
app.use("/api/isloggedin", isloggedinRouter)
app.use("/api/deleteaccount", deleteaccountRouter)
app.use("/api/multiplayer", multiplayerRouter)
app.use("/api/play", playRouter)

const root = path.join(__dirname, "../../client/build")
app.use(express.static(root))
app.get("*", (req, res) => {
    res.sendFile("index.html", { root })
})

server.listen(PORT, () => console.log("Server starting on " + process.env.BACKEND_URL))
