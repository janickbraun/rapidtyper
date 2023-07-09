import { Router, Request, Response, NextFunction } from "express"
const router = Router()
import Skin from "../../../models/Skin"
import Shop from "../../../models/Shop"

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const shop = await Shop.findOne({})
        if (!shop) return await Shop.create({ skins: [], lastRequest: new Date() })

        const now = new Date()

        let tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)

        let diff = tomorrow.getTime() - now.getTime()
        let seconds = Math.round(diff / 1000)

        if (shop.lastRequest.getDay() === now.getDay() && shop.lastRequest.getMonth() === now.getMonth() && shop.lastRequest.getFullYear() === now.getFullYear()) {
            await Shop.findByIdAndUpdate(shop.id, {
                $set: {
                    lastRequest: now,
                },
            })

            return res.status(200).send({ skins: shop.skins, seconds })
        } else {
            let allSkins = await Skin.find({ price: { $gt: 0 } }, ["name", "filename", "description", "price"])
            allSkins.push(Object(await Skin.findOne({ filename: "jesus" })))

            let randomIndexes = []
            while (randomIndexes.length < 8) {
                let random = Math.floor(Math.random() * allSkins.length)
                if (randomIndexes.indexOf(random) === -1) randomIndexes.push(random)
            }

            let skins = []
            for (let i = 0; i < randomIndexes.length; i++) {
                skins.push(allSkins[randomIndexes[i]])
            }

            await Shop.findByIdAndUpdate(shop.id, {
                $set: {
                    lastRequest: now,
                    skins,
                },
            })

            return res.status(200).send({ skins, seconds })
        }
    } catch {
        res.status(400).send("Something went wrong")
    }
})

export default router
