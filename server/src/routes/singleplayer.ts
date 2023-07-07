import { Router, Request, Response, NextFunction } from "express"
import User from "../../models/User"
import dotenv from "dotenv"
import jwt from "jsonwebtoken"
import { unlock } from "./unlockFun"
dotenv.config()
const router = Router()

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.body.token

        const temporaryUser: any = jwt.verify(token, process.env.JWT_SECRET as string)
        const user = await User.findOne({
            _id: temporaryUser.id,
        })

        if (!user) return res.status(300).send("Not authenticated")

        const wpm = req.body.wpm
        const accuracy = req.body.accuracy
        const time = req.body.time
        const date = req.body.date

        if (!wpm || !accuracy || !time || !date) return res.status(300).send("Invalid params")

        let tempAcc = user.singleplayerAccuracy
        let tempWpm = user.singleplayerWpm
        if (tempAcc.length >= 10) {
            tempAcc.shift()
            tempWpm.shift()
        }

        let bestSpeed = false

        if (wpm > user.singleplayerBest) {
            bestSpeed = true
        }

        tempAcc.push(accuracy)
        tempWpm.push(wpm)

        if (bestSpeed) unlock("fly", user, 0)

        await User.findByIdAndUpdate(user.id, {
            $set: {
                singleplayerTotalRaces: user.singleplayerTotalRaces + 1,
                singleplayerWpm: tempWpm,
                singleplayerAccuracy: tempAcc,
                singleplayerBest: bestSpeed ? wpm : user.singleplayerBest,
                singleplayerTimeSpent: user.singleplayerTimeSpent + time,
                lastGame: new Date(),
            },
        })

        return res.sendStatus(200)
    } catch (e) {
        console.log(e)
        return res.status(400).send("Something went wrong")
    }
})

export default router
