import fs from "fs"
import path from "path"
import PDFDocument from "pdfkit"

export default function createInvoice(invoice: any, filename: string) {
    let doc = new PDFDocument({ size: "A4", margin: 50 })

    generateHeader(doc)
    generateCustomerInformation(doc, invoice)
    generateInvoiceTable(doc, invoice)
    generateFooter(doc)

    doc.end()
    doc.pipe(fs.createWriteStream(path.join(__filename, "..", filename)))
}

function generateHeader(doc: any) {
    doc.image(path.join(__filename, "..", "..", "..", "..", "assets", "rapidtyper-logo.png"), 50, 45, { height: 45 })
        .fillColor("#444444")
        .image(path.join(__filename, "..", "..", "..", "..", "assets", "grovider-logo.png"), 53, 97, { width: 100 })
        .fontSize(10)
        .text("Grovider Ltda.", 200, 50, { align: "right" })
        .text("Naranjal, 1km Al Sur De La Iglesia Catolica", 200, 65, { align: "right" })
        .text("50207 Nosara, Guanacaste, Costa Rica", 200, 80, { align: "right" })
        .moveDown()
}

function generateCustomerInformation(doc: any, invoice: any) {
    doc.fillColor("#444444").fontSize(20).text("Invoice", 50, 160)

    generateHr(doc, 185)

    const customerInformationTop = 200

    doc.fontSize(10)
        .text("Invoice ID:", 50, customerInformationTop)
        .font("Helvetica-Bold")
        .text(invoice.invoice_nr, 150, customerInformationTop)
        .font("Helvetica")
        .text("Invoice Date:", 50, customerInformationTop + 15)
        .text(formatDate(new Date()), 150, customerInformationTop + 15)
        .text("Balance Due:", 50, customerInformationTop + 30)
        .text(formatCurrency(invoice.subtotal - invoice.paid), 150, customerInformationTop + 30)

        .font("Helvetica-Bold")
        .text(invoice.shipping.name, 300, customerInformationTop)
        .font("Helvetica")
        .text(invoice.shipping.address, 300, customerInformationTop + 15)
        .text(invoice.shipping.city + ", " + invoice.shipping.state + ", " + invoice.shipping.country, 300, customerInformationTop + 30)
        .moveDown()

    generateHr(doc, 252)
}

function generateInvoiceTable(doc: any, invoice: any) {
    let i
    const invoiceTableTop = 330

    doc.font("Helvetica-Bold")
    generateTableRow(doc, invoiceTableTop, "Item", "Description", "Unit Cost", "Quantity", "Line Total")
    generateHr(doc, invoiceTableTop + 20)
    doc.font("Helvetica")

    for (i = 0; i < invoice.items.length; i++) {
        const item = invoice.items[i]
        const position = invoiceTableTop + (i + 1) * 30
        generateTableRow(doc, position, item.item, item.description, formatCurrency(item.amount / item.quantity), item.quantity, formatCurrency(item.amount))

        generateHr(doc, position + 20)
    }

    const subtotalPosition = invoiceTableTop + (i + 1) * 30
    generateTableRow(doc, subtotalPosition, "", "", "Subtotal", "", formatCurrency(invoice.subtotal))

    const paidToDatePosition = subtotalPosition + 20
    generateTableRow(doc, paidToDatePosition, "", "", "Paid To Date", "", formatCurrency(invoice.paid))

    const duePosition = paidToDatePosition + 25
    doc.font("Helvetica-Bold")
    generateTableRow(doc, duePosition, "", "", "Balance Due", "", formatCurrency(invoice.subtotal - invoice.paid))
    doc.font("Helvetica")
}

function generateFooter(doc: any) {
    doc.fontSize(10).text("Thank you for your purchase!", 50, 780, { align: "center", width: 500 })
}

function generateTableRow(doc: any, y: any, item: any, description: any, unitCost: any, quantity: any, lineTotal: any) {
    doc.fontSize(10)
        .text(item, 50, y)
        .text(description, 150, y)
        .text(unitCost, 280, y, { width: 90, align: "right" })
        .text(quantity, 370, y, { width: 90, align: "right" })
        .text(lineTotal, 0, y, { align: "right" })
}

function generateHr(doc: any, y: any) {
    doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, y).lineTo(550, y).stroke()
}

function formatCurrency(cents: any) {
    return "$" + (cents / 100).toFixed(2)
}

function formatDate(date: any) {
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()

    return year + "/" + month + "/" + day
}
