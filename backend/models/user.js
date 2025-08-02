import { model, Schema } from "mongoose";

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["admin", "volunteer", "community-member"],
        default: "community-member",
    },
    name: {
        type: String,
        required: true,
    },
    banned: {
        type: Boolean,
        default: false,
    }
})

export const users = model("User", userSchema);