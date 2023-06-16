import { Router, Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import User from "../../../models/User"
import dotenv from "dotenv"
import Verify from "../../../models/Verify"
dotenv.config()
const router = Router()

function isBlank(str: string) {
    return !str || /^\s*$/.test(str)
}

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    const username: string = req.body.username
    const code: string = req.body.token

    if (isBlank(username) || isBlank(code)) return res.status(403).send("Invalid username or code")

    try {
        const verifyCode = await Verify.findOne({ code, user: username })
        const verifyUser = await User.findOne({ username })
        if (!verifyCode) return res.status(400).send("Invalid code or user")

        if (!verifyUser) return res.status(400).send("Invalid user")

        await User.findByIdAndUpdate(verifyUser.id, {
            $set: {
                verified: true,
            },
        })

        await Verify.findByIdAndDelete(verifyCode.id)

        const skins = verifyUser.skins

        if (skins.includes("sheep")) return res.status(200).send("Successfully verified email")

        await User.findByIdAndUpdate(verifyUser.id, {
            $push: {
                skins: "sheep",
            },
        })

        res.status(200).send("Successfully verified email")
    } catch (e) {
        console.log(e)
        return res.status(400).send("Something went wrong")
    }
})

export default router
