import { Router, Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import User from "../../../models/User"
import dotenv from "dotenv"
import paypal from "paypal-rest-sdk"
import Skin from "../../../models/Skin"
import createInvoice from "./createInvoice"
import path from "path"
import fs from "fs"
import nodemailer from "nodemailer"
dotenv.config()
const router = Router()

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    const payerId: string = req.body.payerId
    const paymentId: string = req.body.paymentId
    const token: string = req.body.token
    const skin: string = req.body.skin

    if (!paymentId || !payerId || !token || !skin) return res.status(300).send("Invalid params")

    try {
        const temporaryUser: any = jwt.verify(token, process.env.JWT_SECRET as string)
        const verifyUser = await User.findOne({
            _id: temporaryUser.id,
        })

        if (!verifyUser) return res.status(400).send("Not authenticated")
        if (!verifyUser.verified) return res.status(400).send("Please verify your email adress first")

        const validSkins = await Skin.find({ price: { $gt: 0 } })

        if (!validSkins.some((e) => e.filename === skin)) return res.status(400).send("Skin is not valid")

        const skins = verifyUser.skins

        if (skins.includes(skin)) return res.status(400).send("You already own this skin")

        const buyingSkin = await Skin.findOne({ filename: skin })
        if (!buyingSkin) return res.status(400).send("Skin not found")

        const clientId = process.env.CLIENT_ID_PAYPAL
        const clientSecret = process.env.CLIENT_SECRET_PAYPAL
        const paypalStatus = process.env.PAYPAL_STATUS

        if (!clientId || !clientSecret || !paypalStatus) return res.status(500).send("No valid client-id or client-secret")

        paypal.configure({
            mode: paypalStatus,
            client_id: clientId,
            client_secret: clientSecret,
        })

        const execute_payment_json = {
            payer_id: payerId,
            transactions: [
                {
                    amount: {
                        currency: "USD",
                        total: buyingSkin?.price,
                    },
                },
            ],
        }

        paypal.payment.execute(paymentId, execute_payment_json, async (error, payment: any) => {
            if (error) {
                console.error(error.response)
                res.status(400).send("Payment went wrong")
            } else {
                console.log(JSON.stringify(payment, null, 2))

                const invoice = {
                    shipping: {
                        name: payment.payer.payer_info.first_name + " " + payment.payer.payer_info.last_name,
                        address: payment.payer.payer_info.shipping_address?.line2 + " " + payment.payer.payer_info.shipping_address?.line1,
                        city: payment.payer.payer_info.shipping_address.city,
                        state: payment.payer.payer_info.shipping_address.state,
                        country: payment.payer.payer_info.shipping_address.country_code,
                        postal_code: payment.payer.payer_info.shipping_address.postal_code,
                    },
                    items: [
                        {
                            item: buyingSkin.name,
                            description: "RapidTyper skin",
                            quantity: 1,
                            amount: buyingSkin.price * 100,
                        },
                    ],
                    subtotal: buyingSkin.price * 100,
                    paid: buyingSkin.price * 100,
                    invoice_nr: payment.id.split("-MSS")[1],
                }

                const pdfFilename = "Invoice-" + verifyUser.username + "-" + payment.id.split("-MSS")[1] + ".pdf"

                createInvoice(invoice, pdfFilename)

                const pdfPath = path.join(__filename, "..", pdfFilename)

                try {
                    let transporter = nodemailer.createTransport({
                        host: "smtp.hostinger.com",
                        port: 465,
                        secure: true,
                        auth: {
                            user: "rapidtyper@grovider.co",
                            pass: process.env.EMAIL_PASSWORD,
                        },
                    })

                    let mailList = ["rapidtyper@grovider.co"]
                    if (verifyUser.email !== payment.payer.payer_info.email) {
                        mailList.push(verifyUser.email, payment.payer.payer_info.email)
                    } else {
                        verifyUser.email
                    }

                    await transporter.sendMail({
                        from: '"RapidTyper" <rapidtyper@grovider.co>',
                        to: mailList,
                        subject: "Thank you for your purchase on RapidTyper!",
                        text:
                            "Hey " +
                            verifyUser.username +
                            "!\nThank you for your purchase on RapidTyper! We sent you an confirmation in form of an invoice. Please check the attachment." +
                            "\n\nBest regards,\nYour RapidTyper-Team", // plain text body
                        attachments: [{ filename: pdfFilename, path: pdfPath }],
                        //html: "<div></div>", // html body
                    })

                    try {
                        fs.unlinkSync(pdfPath)
                    } catch {}
                } catch {}

                await User.findByIdAndUpdate(verifyUser.id, {
                    $push: {
                        skins: payment.transactions[0].item_list?.items[0].name,
                    },
                })

                res.status(200).send({ name: buyingSkin.name, filename: buyingSkin.filename, price: buyingSkin.price })
            }
        })
    } catch {
        return res.status(400).send("Something went wrong")
    }
})

export default router
