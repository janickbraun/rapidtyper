import { Router, Request, Response, NextFunction } from "express"
import dotenv from "dotenv"
import jwt from "jsonwebtoken"
import User from "../../../models/User"
import TextRequest from "../../../models/TextRequest"
dotenv.config()
const router = Router()

function isBlank(str: string) {
    return !str || /^\s*$/.test(str)
}

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.body.token

        if (isBlank(token)) return res.status(400).send("Invalid inputs")
        const temporaryUser: any = jwt.verify(token, process.env.JWT_SECRET as string)
        const verifyUser = await User.findOne({
            _id: temporaryUser.id,
        })
        if (!verifyUser) return res.status(400).send("Not authenticated")
        if (verifyUser.id !== "647c7fb8c556cce5a087b8aa" && verifyUser.id !== "648318cafcbd35aa43fc8b0f") return res.status(400).send("No permission")

        const requests = await TextRequest.find({})

        let send = []

        for (let i = 0; i < requests.length; i++) {
            const r = requests[i]
            const user = await User.findById(r.user)
            send.push({ username: user?.username, text: r.text, autor: r.author, url: r.url, creationDate: r.creationDate })
        }

        return res.status(200).json({ requests: send })
    } catch {
        return res.status(400).send("Something went wrong")
    }
})

export default router
