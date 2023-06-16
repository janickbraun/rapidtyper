import { Router, Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import User from "../../../models/User"
import dotenv from "dotenv"
import bcrypt from "bcryptjs"

dotenv.config()
const router = Router()

function isBlank(str: string) {
    return !str || /^\s*$/.test(str)
}

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    const oldPassword: string = req.body.oldPassword
    const newPassword: string = req.body.newPassword
    const confirmPassword: string = req.body.confirmPassword
    const token: string = req.body.token

    if (isBlank(oldPassword) || isBlank(newPassword) || isBlank(confirmPassword) || isBlank(token)) return res.status(403).send("Invalid inputs")
    if (newPassword !== confirmPassword) return res.status(400).send("Passwords do not match")
    if (newPassword.length < 6) return res.status(400).send("Password has to be at least 6 characters long")

    try {
        const temporaryUser: any = jwt.verify(token, process.env.JWT_SECRET as string)
        const verifyUser = await User.findOne({
            _id: temporaryUser.id,
        })
        if (!verifyUser) return res.status(400).send("Not authenticated")

        if (await bcrypt.compare(oldPassword, verifyUser.password)) {
            await User.findByIdAndUpdate(verifyUser.id, {
                $set: {
                    password: await bcrypt.hash(newPassword, 10),
                },
            })

            return res.status(200).send("Successfully changed password")
        } else {
            return res.status(400).send("Invalid password")
        }
    } catch {
        return res.status(400).send("Something went wrong")
    }
})

export default router
