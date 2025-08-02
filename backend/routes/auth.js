import { users, sessions } from "../models/index.js";
import { Router } from "express";

const router = Router();

router.get("/me", async (req, res) => {
    const sessionId = req.cookies.session_id;
    const session = await sessions.findOne({ _id: sessionId });
    if (!session) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const user = await users.findOne({ email: session.email }).select("-password");
    res.json(user.toJSON());
})

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await users.findOne({ email, password });
    if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
    }
    if (user.banned) {
        return res.status(403).json({ error: "User is banned" });
    }
    const session = await sessions.create({ email: user.email, valid_until: new Date(Date.now() + 3600000) });
    res.cookie("session_id", session._id);
    res.json(user.toJSON());
})

router.post("/register", async (req, res) => {
    const { email, password, name } = req.body;
    const existingUser = await users.findOne({ email });
    if (existingUser) {
        return res.status(409).json({ error: "User already exists" });
    }
    const user = await users.create({ email, password, name });
    const session = await sessions.create({ email: user.email, valid_until: new Date(Date.now() + 3600000) });
    res.cookie("session_id", session._id);
    res.json(user.toJSON());
})

export default router;