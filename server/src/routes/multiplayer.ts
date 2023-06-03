import { Router, Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import User from "../../models/User"
import Lobby from "../../models/Lobby"
import Text from "../../models/Text"
import dotenv from "dotenv"
dotenv.config()
const router = Router()

const getLobbyCode = async () => {
    const val = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1) as string

    const doesLobbyAlreadyExist = await Lobby.exists({ code: val })

    if (doesLobbyAlreadyExist) getLobbyCode()

    return val
}

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.body.token
        const temporaryUser: any = jwt.verify(token, process.env.JWT_SECRET as string)
        const loggedin = await User.exists({ _id: temporaryUser.id })

        const findLobby = await Lobby.findOne({
            joinable: true,
        })

        if (findLobby) return res.status(200).json({ code: findLobby.code })

        const code = (await getLobbyCode()).toString()
        const text = await Text.aggregate([{ $sample: { size: 1 } }])

        await Lobby.create({ code, text: text[0]._id })
        return res.status(200).json({ code })
    } catch {
        return res.status(400).send("Something went wrong")
    }
})

export default router
