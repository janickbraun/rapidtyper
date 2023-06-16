import { Router, Request, Response, NextFunction } from "express"
import Reset from "../../../models/Reset"
import User from "../../../models/User"
import dotenv from "dotenv"
import nodemailer from "nodemailer"
import bcrypt from "bcryptjs"
dotenv.config()
const router = Router()

function isBlank(str: string) {
    return !str || /^\s*$/.test(str)
}

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    const password: string = req.body.password
    const passwordConfirm: string = req.body.passwordConfirm
    const username: string = req.body.username
    const code: string = req.body.code

    if (isBlank(password) || isBlank(passwordConfirm)) return res.status(403).send("Invalid inputs")
    if (isBlank(username) || isBlank(code) || !code) return res.status(403).send("Invalid parameters")

    if (password !== passwordConfirm) return res.status(400).send("Passwords do not match")

    if (password.length < 6) return res.status(400).send("Password has to be at least 6 characters long")

    try {
        const verifyCode = await Reset.findOne({ code, user: username })
        const verifyUser = await User.findOne({ username })
        if (!verifyCode) return res.status(400).send("Invalid reset code or user")

        if (new Date().getTime() - verifyCode.creationDate.getTime() >= 24 * 60 * 60 * 1000) res.status(400).send("Reset code is older than 24 hours")

        if (!verifyUser) return res.status(400).send("Invalid user")

        await User.findByIdAndUpdate(verifyCode.id, {
            $set: {
                password: await bcrypt.hash(password, 10),
            },
        })

        await Reset.findByIdAndDelete(verifyCode.id)

        const allCodes = await Reset.find({})

        for (let i = 0; i < allCodes.length; i++) {
            if (new Date().getTime() - allCodes[i].creationDate.getTime() >= 24 * 60 * 60 * 1000) {
                await Reset.findByIdAndDelete(allCodes[i].id)
            }
        }

        try {
            let transporter = nodemailer.createTransport({
                host: "smtp.hostinger.com",
                port: 465,
                secure: true,
                auth: {
                    user: "rapidtyper@grovider.co",
                    pass: process.env.EMAIL_PASSWORD,
                },
            })

            await transporter.sendMail({
                from: '"RapidTyper" <rapidtyper@grovider.co>',
                to: verifyUser.email,
                subject: "Password has been reset",
                text: "Your password on rapidtyper.com hast been reset. If this was not you, please reply to this email immediately!",
                //html: "<div></div>", // html body
            })
        } catch {}

        res.status(200).send("Email has been successfully reset")
    } catch (e) {
        console.log(e)
        return res.status(400).send("Something went wrong")
    }
})

export default router
