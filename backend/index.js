import express from "express";
import { auth, ticket, admin } from "./routes/index.js"
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

// Use JSON and URL-encoded body parsers
app.use(express.json());
app.use(cookieParser());

// Add routers
app.use("/auth", auth);
app.use("/tickets", ticket);
app.use("/admin", admin);

// Set up CORS
const allowedOrigins = [
  'http://localhost:5173'
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Export function to start the API
async function startAPI(
    mongo_srv,
    port = 3000
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