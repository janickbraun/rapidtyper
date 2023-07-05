import { Router, Request, Response, NextFunction } from "express"
import User from "../../models/User"
import dotenv from "dotenv"
import jwt from "jsonwebtoken"
dotenv.config()
const router = Router()

const getAverage = (arr: Array<number>) => {
    const sum = arr.reduce((a: number, b: number) => a + b, 0)
    const avg = sum / arr.length || 0
    return Number(avg.toFixed(2))
}

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.body.token

        const temporaryUser: any = jwt.verify(token, process.env.JWT_SECRET as string)
        const verifyUser = await User.findOne({
            _id: temporaryUser.id,
        })

        if (!verifyUser) return res.status(200).send("Not authenticated")

        const wpm = getAverage(verifyUser.singleplayerWpm)
        const accuracy = getAverage(verifyUser.singleplayerAccuracy)
        const racesTotal = verifyUser.singleplayerTotalRaces
        const bestRace = verifyUser.singleplayerBest
        const time = verifyUser.singleplayerTimeSpent

        return res.status(200).json({ wpm, accuracy, racesTotal, bestRace, time, status: "ok" })
    } catch {
        return res.status(200).send("Something went wrong")
    }
})

export default router
