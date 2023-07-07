import mongoose from "mongoose"

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        verified: {
            type: Boolean,
            default: false,
        },
        country: {
            type: String,
            required: true,
        },
        wpm: {
            type: Array,
            default: [],
        },
        accuracy: {
            type: Array,
            default: [],
        },
        racesWon: {
            type: Number,
            default: 0,
        },
        racesTotal: {
            type: Number,
            default: 0,
        },
        bestRace: {
            type: Number,
            default: 0,
        },
        timeSpentRacing: {
            type: Number,
            default: 0,
        },
        skins: {
            type: Array,
            default: ["snail"],
        },
        skin: {
            type: String,
            default: "snail",
        },
        singleplayerWpm: {
            type: Array,
            default: [],
        },
        singleplayerAccuracy: {
            type: Array,
            default: [],
        },
        singleplayerTotalRaces: {
            type: Number,
            default: 0,
        },
        singleplayerBest: {
            type: Number,
            default: 0,
        },
        singleplayerTimeSpent: {
            type: Number,
            default: 0,
        },
        password: {
            type: String,
            required: true,
        },
        lastGame: {
            type: Date,
        },
        creationDate: {
            type: Date,
            default: Date.now,
        },
    },
    {
        collection: "users",
    }
)

const model = mongoose.model("UserSchema", UserSchema)

export default model
