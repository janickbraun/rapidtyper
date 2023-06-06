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
        const type = String(req.body.type).toLowerCase().replace(/\s/g, "")
        if (type === "wpm" || type === "accuracy") {
            const allUsers = await User.find({})
            let temp = []
            for (let i = 0; i < allUsers.length; i++) {
                let { username, racesWon, racesTotal, creationDate, bestRace } = allUsers[i]
                temp.push({ wpm: [getAverage(allUsers[i].wpm)], accuracy: [getAverage(allUsers[i].accuracy)], username, racesTotal, racesWon, creationDate, bestRace })
            }
            if (type === "wpm") {
                const wpm = temp.sort((a, b) => b.wpm[0] - a.wpm[0])
                return res.status(200).json({ data: wpm })
            } else if (type === "accuracy") {
                const accuracy = temp.sort((a, b) => b.accuracy[0] - a.accuracy[0])
                return res.status(200).json({ data: accuracy })
            }
        } else if (type === "totalraces") {
            const total = await User.find({}, ["username", "racesWon", "racesTotal", "creationDate", "bestRace", "wpm", "accuracy"], { limit: 10, sort: { racesTotal: -1 } })
            return res.status(200).json({ data: total })
        } else if (type === "raceswon") {
            const won = await User.find({}, ["username", "racesWon", "racesTotal", "creationDate", "bestRace", "wpm", "accuracy"], { limit: 10, sort: { racesWon: -1 } })
            return res.status(200).json({ data: won })
        } else if (type === "bestrace") {
            const best = await User.find({}, ["username", "racesWon", "racesTotal", "creationDate", "bestRace", "wpm", "accuracy"], { limit: 10, sort: { bestRace: -1 } })
            return res.status(200).json({ data: best })
        } else if (type === "age") {
            const date = await User.find({}, ["username", "racesWon", "racesTotal", "creationDate", "bestRace", "wpm", "accuracy"], { limit: 10, sort: { creationDate: 1 } })
            return res.status(200).json({ data: date })
        } else {
            return res.status(300).send("Invalid leaderboard type")
        }
    } catch (e) {
        console.log(e)
        //return res.status(400).send("Something went wrong")
    }
})

export default router
