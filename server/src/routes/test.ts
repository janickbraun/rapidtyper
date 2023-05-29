import { Router, Request, Response, NextFunction } from "express"
import eBayApi from "ebay-api"

const router = Router()
const eBay = new eBayApi({
    appId: "-- also called Client ID --",
    certId: "-- also called Client Secret --",
    sandbox: false,
})

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
    const item = await eBay.buy.browse.getItem("v1|254188828753|0")
    console.log(JSON.stringify(item, null, 2))
    res.send("Server is online")
})

export default router
