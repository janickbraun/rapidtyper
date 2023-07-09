import { Router, Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import User from "../../../models/User"
import Verify from "../../../models/Verify"
import dotenv from "dotenv"
import bcrypt from "bcryptjs"
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
    const password: string = req.body.password
    const newEmail: string = req.body.email?.trim()
    const token: string = req.body.token

    if (isBlank(password) || isBlank(newEmail) || isBlank(token)) return res.status(403).send("Invalid inputs")
    if (!validateEmail(newEmail)) return res.status(403).send("Invalid email")

    try {
        const temporaryUser: any = jwt.verify(token, process.env.JWT_SECRET as string)
        const verifyUser = await User.findOne({
            _id: temporaryUser.id,
        })
        if (!verifyUser) return res.status(400).send("Not authenticated")

        if (await bcrypt.compare(password, verifyUser.password)) {
            if (verifyUser.email === newEmail) return res.status(400).send("You already use this email")
            if (await User.exists({ email: newEmail })) return res.status(400).send("This email is already in use")
            await User.findByIdAndUpdate(verifyUser.id, {
                $set: {
                    email: newEmail,
                    verified: false,
                },
            })

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

                const code = crypto.randomUUID()

                const link = process.env.FRONTEND_URL + "/account/verify?code=" + code + "&user=" + verifyUser.username

                await Verify.create({ user: verifyUser.username, code })

                await transporter.sendMail({
                    from: '"RapidTyper" <rapidtyper@grovider.co>',
                    to: newEmail,
                    subject: "Please verify your new email on RapidTyper",
                    text:
                        "Hey " + verifyUser.username + "!\nYou just changed your email on RapidTyper. Please verify your new email by clicking the following link: " + link + "\nYour RapidTyper-Team", // plain text body
                    //html: "<div></div>", // html body
                })
            } catch {}

            return res.status(200).send("Successfully changed email")
        } else {
            return res.status(400).send("Invalid password")
        }
    } catch {
        return res.status(400).send("Something went wrong")
    }
})

export default router
