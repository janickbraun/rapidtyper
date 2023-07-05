import { Router, Request, Response, NextFunction } from "express"
import createInvoice from "./shop/createInvoice"
const router = Router()

router.get("/", (req: Request, res: Response, next: NextFunction) => {
    const invoice = {
        shipping: {
            name: "John Doe",
            address: "1234 Main Street",
            city: "San Francisco",
            state: "CA",
            country: "US",
            postal_code: 94111,
        },
        items: [
            {
                item: "Pooping dog",
                description: "RapidTyper skin",
                quantity: 1,
                amount: 1,
            },
        ],
        subtotal: 10,
        paid: 10,
        invoice_nr: 1,
    }

    createInvoice(invoice)
    res.send("/ : Cannot get route")
})

export default router
