import { Router, Request, Response, NextFunction } from "express"
import dotenv from "dotenv"
import jwt from "jsonwebtoken"
import User from "../../../models/User"
import Skin from "../../../models/Skin"
dotenv.config()
const router = Router()

function isBlank(str: string) {
    return !str || /^\s*$/.test(str)
}

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.body.token
        const name = req.body.name
        const filename = req.body.filename
        const description = req.body.description
        const price = req.body.price

        if (isBlank(token) || isBlank(name) || isBlank(filename) || isBlank(description) || isBlank(price)) return res.status(400).send("Invalid inputs")
        const temporaryUser: any = jwt.verify(token, process.env.JWT_SECRET as string)
        const verifyUser = await User.findOne({
            _id: temporaryUser.id,
        })
        if (!verifyUser) return res.status(400).send("Not authenticated")
        if (verifyUser.id !== "647c7fb8c556cce5a087b8aa" && verifyUser.id !== "648318cafcbd35aa43fc8b0f") return res.status(400).send("No permission")

        await Skin.create({ filename, name, description, price })

        return res.sendStatus(200)
    } catch {
        return res.status(400).send("Something went wrong")
    }
})

export default router
