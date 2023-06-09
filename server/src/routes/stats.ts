import { Router, Request, Response, NextFunction } from "express"
import User from "../../models/User"
import dotenv from "dotenv"
import Skin from "../../models/Skin"
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
        const username = req.body.username
        const token = req.body.token

        let myAccount = false

        try {
            const temporaryUser: any = jwt.verify(token, process.env.JWT_SECRET as string)
            const verifyUser = await User.findOne({
                _id: temporaryUser.id,
            })
            if (verifyUser && verifyUser.username === username) myAccount = true
        } catch {}

        const user = await User.findOne({ username })

        if (!user) return res.status(300).send("No valid user")

        const wpm = getAverage(user.wpm)
        const accuracy = getAverage(user.accuracy)
        const racesTotal = user.racesTotal
        const racesWon = user.racesWon
        const bestRace = user.bestRace
        const date = user.creationDate
        const skin = user.skin
        const country = user.country
        const time = user.timeSpentRacing

        const tempDate = date.toLocaleDateString("de-DE", { weekday: "short", year: "numeric", month: "numeric", day: "numeric" })
        const finalDate = tempDate.split(" ")[1]

        if (myAccount) {
            let tempSkins = user.skins

            const skins = await Skin.find({ filename: { $in: tempSkins } })

            tempSkins.push("jesus")

            const toBeUnlocked = await Skin.find({ price: 0, filename: { $nin: tempSkins } })

            return res.status(200).json({ wpm, accuracy, racesTotal, racesWon, bestRace, date: finalDate, skin, skins, country, time, toBeUnlocked })
        } else {
            return res.status(200).json({ wpm, accuracy, racesTotal, racesWon, bestRace, date: finalDate, skin, country, time })
        }
    } catch {
        return res.status(400).send("Something went wrong")
    }
})

export default router
