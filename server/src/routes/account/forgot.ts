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

const validateEmail = (email: string) => {
    return String(email)
        .toLowerCase()
        .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
}

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    const email: string = req.body.email

    if (isBlank(email) || !validateEmail(email)) return res.status(403).send("Invalid email")

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
                text: "Hey " + verifyUser.username + "!\nReset your password with this link: " + link + " \nIf this was not you please just ignore this email.\nYour RapidTyper-Team", // plain text body
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
