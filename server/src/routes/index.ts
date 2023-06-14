import { Router, Request, Response, NextFunction } from "express"
const router = Router()

router.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.send("API - 404")
})

export default router
