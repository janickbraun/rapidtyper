import { Router, Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import User from "../../../models/User"
import dotenv from "dotenv"
dotenv.config()
const router = Router()

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    const skin: string = req.body.skin
    const token: string = req.body.token

    try {
        const temporaryUser: any = jwt.verify(token, process.env.JWT_SECRET as string)
        const verifyUser = await User.findOne({
            _id: temporaryUser.id,
        })
        if (!verifyUser) return res.status(300).send("Not authenticated")

        if (!verifyUser.skins.includes(skin)) return res.status(300).send("Skin is not available for you")
        if (skin === verifyUser.skin) return res.status(200).json({ skin })

        await User.findByIdAndUpdate(verifyUser.id, {
            $set: {
                skin,
            },
        })
        res.status(200).json({ skin })
    } catch {
        return res.status(400).send("Something went wrong")
    }
})

export default router
