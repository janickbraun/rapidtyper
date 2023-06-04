import { Router, Request, Response, NextFunction } from "express"
const router = Router()
import Text from "../../models/Text"

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const text: any = await Text.aggregate([{ $sample: { size: 1 } }])
        res.status(200).send({ text: text[0].text, author: text[0].author })
    } catch {
        res.status(300).send("Something went wrong")
    }
})

export default router
