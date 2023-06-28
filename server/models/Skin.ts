import mongoose from "mongoose"

const SkinSchema = new mongoose.Schema(
    {
        filename: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
    },
    {
        collection: "skins",
    }
)

const model = mongoose.model("SkinSchema", SkinSchema)

export default model
