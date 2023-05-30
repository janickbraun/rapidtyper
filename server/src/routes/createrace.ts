import { Router, Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import User from "../../models/User"
import Lobby from "../../models/Lobby"
import dotenv from "dotenv"
dotenv.config()
const router = Router()

const getLobbyCode = async () => {
    let val = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1) as string
    const allLobbys = await Lobby.find()
    for (let i = 0; i < allLobbys.length; i++) {
        if (allLobbys[i].code === val) {
            getLobbyCode()
        }
    }
    return val
}

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.body.token
        const temporaryUser: any = jwt.verify(token, process.env.JWT_SECRET as string)

        const verifyUser = await User.findOne({
            _id: temporaryUser.id,
        })
        if (!verifyUser) return res.status(200).send("No valid user")

        const code = (await getLobbyCode()).toString()

        await Lobby.create({ code })
        return res.status(200).json({ code })
    } catch (e) {
        console.log(e)
        return res.status(400).send("Something went wrong")
    }
})

export default router
