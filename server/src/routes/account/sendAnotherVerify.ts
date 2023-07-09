import { Router, Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import User from "../../../models/User"
import Verify from "../../../models/Verify"
import dotenv from "dotenv"
import nodemailer from "nodemailer"

dotenv.config()
const router = Router()

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    const token = req.body.token

    try {
        const temporaryUser: any = jwt.verify(token, process.env.JWT_SECRET as string)

        const verifyUser = await User.findOne({
            _id: temporaryUser.id,
        })
        if (!verifyUser) return res.status(400).send("Invalid user")

        if (verifyUser.verified) return res.status(400).send("User's email adress is already verified")

        const verifyCode = await Verify.findOne({ user: verifyUser.username })

        if (!verifyCode) return res.status(400).send("No verify code found")

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

            const link = process.env.FRONTEND_URL + "/account/verify?code=" + verifyCode.code + "&user=" + verifyUser.username

            await transporter.sendMail({
                from: '"RapidTyper" <rapidtyper@grovider.co>',
                to: verifyUser.email,
                subject: "Please verify your email on RapidTyper",
                text: "Hey " + verifyUser.username + "!\nWelcome to RapidTyper. Please verify your email by clicking the following link: " + link + "\nYour RapidTyper-Team", // plain text body
                //html: "<div></div>", // html body
            })
        } catch {}
        return res.status(200).send("Successfully sent email")
    } catch {}
    return res.status(400).send("Something went wrong")
})

export default router
