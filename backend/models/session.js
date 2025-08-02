import { Schema, model } from "mongoose";

const sessionSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    valid_until: {
        type: Date,
        required: true
    }
})

export const sessions = model("sessions", sessionSchema);