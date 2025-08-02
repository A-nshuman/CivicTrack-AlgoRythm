import express from "express";
import { auth, ticket } from "./routes/index.js"
import config from "../config.js";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

const app = express();

// Use JSON and URL-encoded body parsers
app.use(express.json());
app.use(cookieParser());

app.use("/auth", auth);
app.use("/tickets", ticket);

async function startAPI(
    port = 3000,
    mongo_srv = config.mongo_srv
) {
    if (!mongo_srv) throw new Error("MongoDB connection string is not provided");

    try {
        await mongoose.connect(mongo_srv);
        console.log("Connected to MongoDB");
    } catch (error) {
        throw new Error("Failed to connect to MongoDB: " + error.message);
    }

    app.listen(port, () => {
        console.log(`API is running on port ${port}`);
    });
}

startAPI()