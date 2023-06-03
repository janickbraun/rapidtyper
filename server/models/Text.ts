import mongoose from "mongoose"

const TextSchema = new mongoose.Schema(
    {
        text: {
            type: String,
            required: true,
        },
        author: {
            type: String,
            required: true,
        },
        creationDate: {
            type: Date,
            default: Date.now,
        },
    },
    {
        collection: "texts",
    }
)

const model = mongoose.model("TextSchema", TextSchema)

export default model
