import { Router, Request, Response, NextFunction } from "express"
import createInvoice from "./shop/createInvoice"
const router = Router()

router.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.send("/ : Cannot get route")
})

export default router
