import { Router, Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import User from "../../models/User"
import Lobby from "../../models/Lobby"
import Text from "../../models/Text"
import dotenv from "dotenv"
dotenv.config()
const router = Router()

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.body.token
        const code = req.body.code
        const io = req.app.get("io")
        const temporaryUser: any = jwt.verify(token, process.env.JWT_SECRET as string)
        const loggedin = await User.exists({ _id: temporaryUser.id })

        const findLobby = await Lobby.findOne({
            code,
        })

        if (!findLobby) return res.status(300).send("No joinable lobby found") // HTTP 409?

        const user = await User.findById(temporaryUser.id)

        if (!loggedin || !user) return res.status(300).send("Invalid user") // HTTP 409?

        const username = user.username

        if (findLobby.participants.length > 4) return res.status(300).json({ reason: "full", username })

        if (!findLobby.participants.some((e) => e.username === username)) {
            await Lobby.updateOne(
                {
                    _id: findLobby._id,
                },
                {
                    $push: {
                        participants: { username, skin: user.skin },
                    },
                }
            )
        }

        const finalLobby = await Lobby.findById(findLobby._id)
        if (!finalLobby) return res.status(300).send("No joinable lobby found")

        const roomSize = finalLobby.participants.length

        if (roomSize === 2) {
            io.to(String(finalLobby.code)).emit("waiting")
        }
        if (roomSize >= 4) {
            await Lobby.updateOne(
                {
                    _id: findLobby._id,
                },
                {
                    $set: {
                        joinable: false,
                    },
                }
            )
            io.to(String(finalLobby.code)).emit("starting")
        }

        const text = await Text.findById(findLobby.text)

        return res.status(200).json({ participants: finalLobby.participants, text, username })
    } catch {
        return res.status(300).send("Something went wrong")
    }
})

export default router
