import mongoose from "mongoose"

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        creationDate: {
            type: Date,
            default: Date.now,
        },
        password: {
            type: String,
            required: true,
        },
    },
    {
        collection: "users",
    }
)

const model = mongoose.model("UserSchema", UserSchema)

export default model
