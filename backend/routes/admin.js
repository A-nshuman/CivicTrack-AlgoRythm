import { users, sessions, tickets } from "../models/index.js";
import { Router } from "express";

const router = Router();

router.use(async (req, res, next) => {
    const sessionId = req.cookies.session_id;
    const session = await sessions.findOne({ _id: sessionId });
    if (!session) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const user = await users.findOne({ email: session.email });
    if (!user || user.banned) {
        return res.status(403).json({ error: "Forbidden" });
    }
    next();
})

router.get("/reported-tickets", async (req, res) => {
    const reportedTickets = await tickets.find({ "reports.count": { $gt: 0 } }).select("activity reports").sort({ "reports.count": -1 });
    res.json(reportedTickets.map(ticket => ticket.toJSON()));
});

router.get("/clear-reports/:id", async (req, res) => {
    const ticket = await tickets.findById(req.params.id);
    if (!ticket) {
        return res.status(404).json({ error: "Ticket not found" });
    }
    ticket.reports.count = 0;
    ticket.reports.comments = [];
    ticket.markModified("reports.comments");
    await ticket.save();
    res.json({ message: "Reports cleared successfully" });
});

router.get("/ban-user/:email", async (req, res) => {
    const { email } = req.params;
    const user = await users.findOne({ email });
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    user.banned = true;
    await user.save();
    res.json({ message: "User banned successfully" });
});

router.get("/unban-user/:email", async (req, res) => {
    const { email } = req.params;
    const user = await users.findOne({ email });
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    user.banned = false;
    await user.save();
    res.json({ message: "User unbanned successfully" });
});

router.get("/banned-users", async (req, res) => {
    const bannedUsers = await users.find({ banned: true }).select("email name").sort({ name: 1 });
    res.json(bannedUsers.map(user => user.toJSON()));
});

export default router;