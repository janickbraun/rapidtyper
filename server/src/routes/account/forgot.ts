import { Router, Request, Response, NextFunction } from "express"
import Reset from "../../../models/Reset"
import User from "../../../models/User"
import dotenv from "dotenv"
import nodemailer from "nodemailer"
import crypto from "crypto"
dotenv.config()
const router = Router()

function isBlank(str: string) {
    return !str || /^\s*$/.test(str)
}

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    const email: string = req.body.email

    if (isBlank(email)) return res.status(403).send("Invalid email")

    try {
        const verifyUser = await User.findOne({ email })
        if (!verifyUser) return res.status(400).send("No user with that email")

        const code = crypto.randomUUID()
        const link = process.env.FRONTEND_URL + "/account/reset?code=" + code + "&user=" + verifyUser.username

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
                subject: "Password reset request",
                text: "Reset your password with this link: " + link, // plain text body
                //html: "<div></div>", // html body
            })
        } catch {}

        await Reset.create({ user: verifyUser.username, code })

        res.status(200).send("Succsessfully sent password resest request to your email")
    } catch {
        return res.status(400).send("Something went wrong")
    }
})

export default router
