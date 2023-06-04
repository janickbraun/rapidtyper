import { Router, Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import User from "../../../models/User"
import dotenv from "dotenv"
dotenv.config()
const router = Router()

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.body.token
        const temporaryUser: any = jwt.verify(token, process.env.JWT_SECRET as string)

        const verifyUser = await User.findOne({
            _id: temporaryUser.id,
        })
        if (!verifyUser) return res.status(200).json({ loggedin: false, username: "" })

        return res.status(200).json({ loggedin: true, username: verifyUser.username })
    } catch {
        return res.status(200).json({ loggedin: false, username: "" })
    }
})

export default router
