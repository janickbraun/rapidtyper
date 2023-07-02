import { Router, Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import User from "../../models/User"
import dotenv from "dotenv"
import nodemailer from "nodemailer"

dotenv.config()
const router = Router()

function isBlank(str: string) {
    return !str || /^\s*$/.test(str)
}

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    const token = req.body.token
    const feedback = req.body.feedback

    try {
        const temporaryUser: any = jwt.verify(token, process.env.JWT_SECRET as string)

        const verifyUser = await User.findOne({
            _id: temporaryUser.id,
        })
        if (!verifyUser) return res.status(400).send("Invalid user")
        if (isBlank(feedback)) return res.status(400).send("Invalid feedback")

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
                to: "rapidtyper@grovider.co",
                subject: "New feedback from " + verifyUser.username,
                text: `New feedback from ${verifyUser.username} (${process.env.FRONTEND_URL + "/user/" + verifyUser.username + " | " + verifyUser.email}) on ${new Date().toLocaleDateString(
                    "de-DE"
                )}\n\n ${feedback}`,
            })
        } catch {}

        const skins = verifyUser.skins

        if (skins.includes("bird")) return res.status(200).json({ skin: false })

        await User.findByIdAndUpdate(verifyUser.id, {
            $push: {
                skins: "bird",
            },
        })

        return res.status(200).json({ skin: true })
    } catch {}
    return res.status(400).send("Something went wrong")
})

export default router
