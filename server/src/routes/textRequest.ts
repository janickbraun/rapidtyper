import { Router, Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import User from "../../models/User"
import TextRequest from "../../models/TextRequest"
import dotenv from "dotenv"

dotenv.config()
const router = Router()

function isBlank(str: string) {
    return !str || /^\s*$/.test(str)
}

function isASCII(str: string) {
    return /^[\x00-\x7F]*$/.test(str)
}

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    const token = req.body.token
    const text = req.body.text
    const author = req.body.author
    const url = req.body.url

    try {
        const temporaryUser: any = jwt.verify(token, process.env.JWT_SECRET as string)

        const verifyUser = await User.findOne({
            _id: temporaryUser.id,
        })
        if (!verifyUser) return res.status(400).send("Invalid user")
        if (isBlank(text) || isBlank(author) || isBlank(url) || !isASCII(text)) return res.status(400).send("Invalid inputs")

        await TextRequest.create({
            user: verifyUser.id,
            text,
            author,
            url,
        })

        return res.sendStatus(200)
    } catch {}
    return res.status(400).send("Something went wrong")
})

export default router
