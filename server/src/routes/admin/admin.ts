import { Router, Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import User from "../../../models/User"
dotenv.config()
const router = Router()

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.body.token

        const temporaryUser: any = jwt.verify(token, process.env.JWT_SECRET as string)
        const verifyUser = await User.findOne({
            _id: temporaryUser.id,
        })
        if (!verifyUser) return res.status(400).send("Not authenticated")
        if (verifyUser.id !== "647c7fb8c556cce5a087b8aa" && verifyUser.id !== "648318cafcbd35aa43fc8b0f") return res.status(400).send("No permission")

        return res.sendStatus(200)
    } catch {
        return res.status(400).send("Something went wrong")
    }
})

export default router
