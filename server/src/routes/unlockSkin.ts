import { Router, Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import User from "../../models/User"
import dotenv from "dotenv"
dotenv.config()
const router = Router()

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.body.token
        const skin = req.body.skin
        const temporaryUser: any = jwt.verify(token, process.env.JWT_SECRET as string)
        const user = await User.findById(temporaryUser.id)

        const validSkins = ["fly", "bee", "bird", "cat", "capybara"]

        if (!validSkins.includes(skin)) return res.status(400).send("Skin is not valid")
        if (!user) return res.status(200).json({ new: false })

        const skins = user.skins

        if (skins.includes(skin)) return res.status(200).json({ new: false })

        await User.findByIdAndUpdate(user.id, {
            $push: {
                skins: skin,
            },
        })

        return res.status(200).json({ new: true, skin })
    } catch {
        return res.status(400).send("Something went wrong")
    }
})

export default router
