import { Router, Request, Response, NextFunction } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../../../models/User"
import dotenv from "dotenv"
import isloggedin from "./isloggedin"
dotenv.config()
const router = Router()

function isBlank(str: string) {
    return !str || /^\s*$/.test(str)
}

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    const confirmationText: string = req.body.confirmationText
    const token: string = req.body.token
    if (confirmationText !== "IRREVERSIBLE") return res.status(403).send("Invalid input")

    try {
        const temporaryUser: any = jwt.verify(token, process.env.JWT_SECRET as string)
        const verifyUser = await User.findOne({
            _id: temporaryUser.id,
        })
        if (!verifyUser) return res.status(400).send("Not authenticated")
        await User.findByIdAndDelete(verifyUser._id)
        res.status(200).send("Successfully deleted account")
    } catch {
        return res.status(400).send("Something went wrong")
    }
})

export default router
