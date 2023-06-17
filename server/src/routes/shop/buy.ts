import { Router, Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import User from "../../../models/User"
import dotenv from "dotenv"
import paypal from "paypal-rest-sdk"
dotenv.config()
const router = Router()

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    const skin: string = req.body.skin
    const token: string = req.body.token

    try {
        const temporaryUser: any = jwt.verify(token, process.env.JWT_SECRET as string)
        const verifyUser = await User.findOne({
            _id: temporaryUser.id,
        })

        if (!verifyUser) return res.status(400).send("Not authenticated")
        if (!verifyUser.verified) return res.status(400).send("Please verify your email adress first")

        const validSkins = ["dog-poop", "whale"]

        if (!validSkins.includes(skin)) return res.status(400).send("Skin is not valid")

        const skins = verifyUser.skins

        if (skins.includes(skin)) return res.status(400).send("You already own this skin")

        const clientId = process.env.CLIENT_ID_PAYPAL
        const clientSecret = process.env.CLIENT_SECRET_PAYPAL

        if (!clientId || !clientSecret) return res.status(300).send("No valid client-id or client-secret")

        paypal.configure({
            mode: "sandbox",
            client_id: clientId,
            client_secret: clientSecret,
        })

        const create_payment_json = {
            intent: "order",
            payer: {
                payment_method: "paypal",
            },
            redirect_urls: {
                return_url: process.env.FRONTEND_URL + "/shop/success",
                cancel_url: process.env.FRONTEND_URL + "/shop/cancel",
            },
            transactions: [
                {
                    item_list: {
                        items: [
                            {
                                name: skin,
                                sku: "001",
                                price: "2.00",
                                currency: "USD",
                                quantity: 1,
                            },
                        ],
                    },
                    amount: {
                        currency: "USD",
                        total: "2.00",
                    },
                    description: "Wonderful looking skin",
                },
            ],
        }

        paypal.payment.create(create_payment_json, async (error: any, payment: any) => {
            if (error) {
                console.error(error)
            } else {
                for (let i = 0; i < payment.links.length; i++) {
                    if (payment.links[i].rel === "approval_url") {
                        res.status(200).json({ link: payment.links[i].href })
                        break
                    }
                }
            }
        })
    } catch {
        return res.status(400).send("Something went wrong")
    }
})

export default router
