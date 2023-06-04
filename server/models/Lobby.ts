import mongoose from "mongoose"

const LobbySchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
        },
        participants: {
            type: Array,
            default: [],
        },
        creationDate: {
            type: Date,
            default: Date.now,
        },
        joinable: {
            type: Boolean,
            default: true,
        },
        finished: {
            type: Boolean,
            default: false,
        },
        text: {
            type: mongoose.Types.ObjectId,
            ref: "texts",
            required: true,
        },
    },
    {
        collection: "lobbys",
    }
)

const model = mongoose.model("LobbySchema", LobbySchema)

export default model
