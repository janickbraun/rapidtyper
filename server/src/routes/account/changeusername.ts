import { Router, Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import User from "../../../models/User"
import dotenv from "dotenv"
dotenv.config()
const router = Router()

function isBlank(str: string) {
    return !str || /^\s*$/.test(str)
}

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    const username: string = req.body.username.trim()
    const token: string = req.body.token

    if (isBlank(username)) return res.status(403).send("Invalid username")
    if (username.length > 10) return res.status(400).send("Username can not be longer than 10 characters")
    if (username.length < 3) return res.status(400).send("Username has to be at least 3 characters long")

    try {
        const temporaryUser: any = jwt.verify(token, process.env.JWT_SECRET as string)
        const verifyUser = await User.findOne({
            _id: temporaryUser.id,
        })
        if (!verifyUser) return res.status(400).send("Not authenticated")

        const isUsernameTaken = await User.exists({ username })
        if (isUsernameTaken) return res.status(403).send("Username is already in use")

        await User.findByIdAndUpdate(verifyUser.id, {
            $set: {
                username,
            },
        })
        res.status(200).send("Successfully changed username")
    } catch {
        return res.status(400).send("Something went wrong")
    }
})

export default router
