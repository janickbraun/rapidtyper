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

const validateEmail = (email: string) => {
    return String(email)
        .toLowerCase()
        .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
}

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    const username: string = req.body.username.trim()
    const email: string = req.body.email.trim()
    const password: string = req.body.password
    const passwordConfirm: string = req.body.passwordConfirm
    if (isBlank(username) || isBlank(email) || isBlank(password) || isBlank(passwordConfirm)) return res.status(403).send("Invalid inputs")
    if (password !== passwordConfirm) return res.status(400).send("Passwords do not match")
    if (!validateEmail(email)) return res.status(403).send("Invalid email")
    if (password.length < 6) return res.status(400).send("Password has to be at least 6 characters long")

    const signedUpUser = new User({ username, email, password: await bcrypt.hash(password, 10) })
    let token = ""
    let isError = false

    try {
        await signedUpUser
            .save()
            .then(async () => {
                const temporaryUser = await User.findOne({ email })
                token = jwt.sign({ id: temporaryUser?._id }, process.env.JWT_SECRET as string)
            })
            .catch((err) => {
                isError = true
                if (err.message.startsWith("E11000")) {
                    return res.status(400).send("Username or email is already in use")
                }
            })
        if (token === "") return res.status(400).send("Something went wrong")
        res.status(200).json({ token })
    } catch {
        if (!isError) return res.status(400).send("Something went wrong")
    }
})

export default router
