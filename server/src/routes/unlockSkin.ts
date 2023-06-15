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
        const temporaryUser: any = jwt.verify(token, process.env.JWT_SECRET as string)
        const loggedin = await User.exists({ _id: temporaryUser.id })

        const findLobby = await Lobby.findOne({
            joinable: true,
        })

        if (findLobby) return res.status(200).json({ code: findLobby.code })

        return res.status(200).json({ new: false })

        return res.status(200).json({ new: true, skin: "ape" })
    } catch {
        return res.status(400).send("Something went wrong")
    }
})

export default router
