import express, { Application } from "express"
import dotenv from "dotenv"
import helmet from "helmet"
import cors from "cors"
import bodyParser from "body-parser"
import path from "path"
import http from "http"

dotenv.config()

const PORT = process.env.PORT

const app: Application = express()
const server = http.createServer(app)

app.use(cors())
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(helmet())

import indexRouter from "./routes/index"
import testRouter from "./routes/test"

app.use("/api", indexRouter)
app.use("/api/test", testRouter)

const root = path.join(__dirname, "../../client/build")
app.use(express.static(root))
app.get("*", (req, res) => {
  res.sendFile("index.html", { root })
})

server.listen(PORT, () => console.log("Server starting on " + process.env.BACKEND_URL))
