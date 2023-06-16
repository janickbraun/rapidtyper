import mongoose from "mongoose"

const ResetSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
        },
        user: {
            type: String,
            required: true,
            unique: true,
        },
        creationDate: {
            type: Date,
            default: Date.now,
        },
    },
    {
        collection: "resets",
    }
)

const model = mongoose.model("ResetSchema", ResetSchema)

export default model
