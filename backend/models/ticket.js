import { model, Schema } from "mongoose";

const ticketSchema = new Schema({
    photos: {
        type: [String]
    },
    category: {
        type: String,
        enum: ["roads", "lighting", "obstructions", "public-safety", "cleanliness", "water-supply", "other"],
        required: true
    },
    title: {
        type: String,
        required: true,
        index: true 
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["open", "in-progress", "closed"],
        default: "open"
    },
    reporter: {
        type: String,
        required: true
    },
    assignedTo: {
        type: String,
        enum: ["admin", "volunteer", "community-member"],
    },
    reports: {
        count: {
            type: Number,
            default: 0
        },
        comments: [String]
    },
    activity: {
        type: [{
            action: {
                type: String,
                enum: ["create", "update", "status-update", "close"],
                required: true
            },
            timestamp: {
                type: Date,
                default: Date.now
            },
            user: {
                type: String,
                required: true
            },
            comment: {
                type: String,
            }
        }]
    },
    coordinates: {
        long: Number,
        lat: Number
    }
})

ticketSchema.index({ title: "text" });

export const tickets = model("Ticket", ticketSchema);