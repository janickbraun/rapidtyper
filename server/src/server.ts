import express, { Application } from "express"
import dotenv from "dotenv"
import helmet from "helmet"
import cors from "cors"
import bodyParser from "body-parser"
import path from "path"
import http from "http"
import mongoose from "mongoose"

dotenv.config()

const PORT = process.env.PORT

const app: Application = express()
const server = http.createServer(app)

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

app.use(cors())
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(helmet())

import indexRouter from "./routes/index"
import signUpRouter from "./routes/account/signup"
import loginRouter from "./routes/account/login"
import isloggedinRouter from "./routes/account/isloggedin"
import deleteaccountRouter from "./routes/account/delete"
import createRaceRouter from "./routes/createrace"

app.use("/api", indexRouter)
app.use("/api/signup", signUpRouter)
app.use("/api/login", loginRouter)
app.use("/api/isloggedin", isloggedinRouter)
app.use("/api/deleteaccount", deleteaccountRouter)
app.use("/api/createrace", createRaceRouter)

const root = path.join(__dirname, "../../client/build")
app.use(express.static(root))
app.get("*", (req, res) => {
    res.sendFile("index.html", { root })
})

server.listen(PORT, () => console.log("Server starting on " + process.env.BACKEND_URL))
