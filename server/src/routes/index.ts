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
                item: "TC 100",
                description: "Toner Cartridge",
                quantity: 2,
                amount: 6000,
            },
            {
                item: "USB_EXT",
                description: "USB Cable Extender",
                quantity: 1,
                amount: 2000,
            },
        ],
        subtotal: 8000,
        paid: 0,
        invoice_nr: 1234,
    }

    createInvoice(invoice)
    res.send("/ : Cannot get route")
})

export default router
