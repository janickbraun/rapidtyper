import { Router, Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import User from "../../models/User"
import Lobby from "../../models/Lobby"
import Text from "../../models/Text"
import dotenv from "dotenv"
dotenv.config()
const router = Router()

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    const token = req.body.token
    const code = req.body.code
    const temporaryUser: any = jwt.verify(token, process.env.JWT_SECRET as string)
    const loggedin = await User.exists({ _id: temporaryUser.id })

    const findLobby = await Lobby.findOne({
        joinable: true,
        code,
    })

    if (!findLobby) return res.status(300).send("No joinable lobby found")

    const text = await Text.findById(findLobby.text)

    return res.status(200).json({ participants: findLobby.participants, text })
})

export default router
