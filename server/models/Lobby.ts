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
    },
    {
        collection: "lobby",
    }
)

const model = mongoose.model("LobbySchema", LobbySchema)

export default model
