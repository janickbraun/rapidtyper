import { Router, Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import User from "../../../models/User"
import dotenv from "dotenv"
import paypal from "paypal-rest-sdk"
import Skin from "../../../models/Skin"
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

        if (!verifyUser) return res.status(401).send("Unathorized")
        if (!verifyUser.verified) return res.status(400).send("Please verify your email adress first.")

        const validSkins = await Skin.find({ price: { $gt: 0 } })

        if (!validSkins.some((e) => e.filename === skin)) return res.status(400).send("Skin is not valid.")

        const skins = verifyUser.skins

        if (skins.includes(skin)) return res.status(400).send("You already own this skin.")

        const buyingSkin = await Skin.findOne({ filename: skin })

        if (!buyingSkin) return res.status(400).send("Skin was not found.")

        const clientId = process.env.CLIENT_ID_PAYPAL
        const clientSecret = process.env.CLIENT_SECRET_PAYPAL
        const paypalStatus = process.env.PAYPAL_STATUS

        if (!clientId || !clientSecret || !paypalStatus) return res.status(400).send("No valid client-id or client-secret.")

        paypal.configure({
            mode: paypalStatus,
            client_id: clientId,
            client_secret: clientSecret,
        })

        const create_payment_json = {
            intent: "order",
            payer: {
                payment_method: "paypal",
            },
            redirect_urls: {
                return_url: process.env.FRONTEND_URL + "/shop/success?skin=" + skin,
                cancel_url: process.env.FRONTEND_URL + "/shop/cancel",
            },
            transactions: [
                {
                    item_list: {
                        items: [
                            {
                                name: skin,
                                sku: "001",
                                price: String(buyingSkin.price) + ".00",
                                currency: "USD",
                                quantity: 1,
                            },
                        ],
                    },
                    amount: {
                        currency: "USD",
                        total: String(buyingSkin.price) + ".00",
                    },
                    description: String(buyingSkin.description),
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
        return res.status(500).send("Something went wrong.")
    }
})

export default router
