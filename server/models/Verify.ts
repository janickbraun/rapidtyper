import mongoose from "mongoose"

const VerifySchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
        },
        user: {
            type: String,
            required: true,
        },
    },
    {
        collection: "verifys",
    }
)

const model = mongoose.model("VerifySchema", VerifySchema)

export default model
