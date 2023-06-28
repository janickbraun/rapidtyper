import { Router, Request, Response, NextFunction } from "express"
const router = Router()
import Skin from "../../../models/Skin"

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        let skins = await Skin.find({ price: { $gt: 0 } }, ["name", "filename", "description", "price"])
        skins.push(Object(await Skin.findOne({ filename: "jesus" })))
        res.status(200).send({ skins })
    } catch {
        res.status(300).send("Something went wrong")
    }
})

export default router
