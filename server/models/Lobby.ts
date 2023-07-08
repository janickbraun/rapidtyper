import mongoose from "mongoose"

const LobbySchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            index: true,
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
            index: true,
        },
        finished: {
            type: Boolean,
            default: false,
        },
        finishedDate: {
            type: Date,
            index: true,
        },
        text: {
            type: mongoose.Types.ObjectId,
            ref: "texts",
            required: true,
        },
        startTime: {
            type: Date,
        },
    },
    {
        collection: "lobbys",
    }
)

const model = mongoose.model("LobbySchema", LobbySchema)

export default model
