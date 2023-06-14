import { Router, Request, Response, NextFunction } from "express"
import User from "../../models/User"
import dotenv from "dotenv"
dotenv.config()
const router = Router()

const getAverage = (arr: Array<number>) => {
    const sum = arr.reduce((a: number, b: number) => a + b, 0)
    const avg = sum / arr.length || 0
    return Number(avg.toFixed(2))
}

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const username = req.body.username

        const user = await User.findOne({ username })

        if (!user) return res.status(300).send("No valid user")

        const wpm = getAverage(user.wpm)
        const accuracy = getAverage(user.accuracy)
        const racesTotal = user.racesTotal
        const racesWon = user.racesWon
        const bestRace = user.bestRace
        const date = user.creationDate
        const skin = user.skin
        const skins = user.skins
        const country = user.country

        const tempDate = date.toLocaleDateString("de-DE", { weekday: "short", year: "numeric", month: "numeric", day: "numeric" })
        const finalDate = tempDate.split(" ")[1]

        return res.status(200).json({ wpm, accuracy, racesTotal, racesWon, bestRace, date: finalDate, skin, skins, country })
    } catch {
        return res.status(400).send("Something went wrong")
    }
})

export default router
