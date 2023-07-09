import mongoose from "mongoose"

const ShopSchema = new mongoose.Schema(
    {
        skins: {
            type: Array,
            required: true,
            default: [],
        },
        lastRequest: {
            type: Date,
            default: Date.now,
        },
    },
    {
        collection: "shop",
    }
)

const model = mongoose.model("ShopSchema", ShopSchema)

export default model
