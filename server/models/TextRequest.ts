import mongoose from "mongoose"

const TextRequestSchema = new mongoose.Schema(
    {
        text: {
            type: String,
            required: true,
        },
        author: {
            type: String,
            required: true,
        },
        user: {
            type: mongoose.Types.ObjectId,
            ref: "users",
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
        creationDate: {
            type: Date,
            default: Date.now,
        },
    },
    {
        collection: "textRequests",
    }
)

const model = mongoose.model("TextRequestSchema", TextRequestSchema)

export default model
