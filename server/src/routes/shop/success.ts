import { Router, Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import User from "../../../models/User"
import dotenv from "dotenv"
import paypal from "paypal-rest-sdk"
dotenv.config()
const router = Router()

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    const payerId: string = req.body.payerId
    const paymentId: string = req.body.paymentId
    const token: string = req.body.token
    //const skin: string = req.body.skin

    if (!paymentId || !payerId || !token) return res.status(300).send("Invalid params")

    try {
        const temporaryUser: any = jwt.verify(token, process.env.JWT_SECRET as string)
        const verifyUser = await User.findOne({
            _id: temporaryUser.id,
        })

        if (!verifyUser) return res.status(400).send("Not authenticated")
        if (!verifyUser.verified) return res.status(400).send("Please verify your email adress first")

        const clientId = process.env.CLIENT_ID_PAYPAL
        const clientSecret = process.env.CLIENT_SECRET_PAYPAL

        if (!clientId || !clientSecret) return res.status(300).send("No valid client-id or client-secret")

        // const validSkins = ["dog-poop", "whale"]

        // if (!validSkins.includes(skin) || !skin) return res.status(400).send("Skin is not valid")

        // const skins = verifyUser.skins

        // if (skins.includes(skin)) return res.status(400).send("You already own this skin")

        paypal.configure({
            mode: "sandbox",
            client_id: clientId,
            client_secret: clientSecret,
        })

        const execute_payment_json = {
            payer_id: payerId,
            transactions: [
                {
                    amount: {
                        currency: "USD",
                        total: "2.00",
                    },
                },
            ],
        }

        paypal.payment.execute(paymentId, execute_payment_json, async (error, payment) => {
            if (error) {
                console.error(error.response)
                res.status(400).send("Payment went wrong")
            } else {
                console.log("succ payment")

                await User.findByIdAndUpdate(verifyUser.id, {
                    $push: {
                        skins: payment.transactions[0].item_list?.items[0].name,
                    },
                })

                //TODO check payment

                res.status(200).send("Successfully bought skin")
            }
        })
    } catch {
        return res.status(400).send("Something went wrong")
    }
})

export default router