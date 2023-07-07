import { Router, Request, Response, NextFunction } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../../../models/User"
import dotenv from "dotenv"
dotenv.config()
const router = Router()

function isBlank(str: string) {
    return !str || /^\s*$/.test(str)
}

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    const email: string = req.body.email.trim()
    const password: string = req.body.password
    if (isBlank(email) || isBlank(password)) return res.status(403).send("Invalid inputs")

    try {
        const temporaryUser = await User.findOne({
            email: email,
        })

        if (!temporaryUser) return res.status(401).send("Invalid email or password")

        if (await bcrypt.compare(password, temporaryUser.password)) {
            const token = jwt.sign(
                {
                    id: temporaryUser._id,
                },
                process.env.JWT_SECRET as string
            )
            return res.status(200).json({ token })
        } else {
            return res.status(401).send("Invalid email or password")
        }
    } catch {
        return res.status(400).send("Something went wrong")
    }
})

export default router
