import { makeIssueMail, makeUpdateMail, sendEmail } from "../helper/emailservice.js";
import { users, tickets, sessions } from "../models/index.js";
import { Router } from "express";

import multer from "multer";
const upload = multer({ dest: 'uploads/' });
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const router = Router();

router.get("/", async (req, res) => {
    const lat = Number(req.query.lat);
    const long = Number(req.query.long);
    const dist = Number(req.query.dist);
    const category = req.query.category || "";
    const status = req.query.status || "";
    const title = req.query.title || "";

    if (!dist) {
        const ticketList = await tickets.find({
            category,
            "reports.count": { $lte: 10 },
            title: { $regex: title, $options: "i" },
            status
        }).select("-activity -reports");
        return res.json(ticketList.map(ticket => ticket.toJSON()));
    }

    if (!lat || !long) {
        return res.status(400).json({ error: "Latitude and longitude are required for distance search" });
    }

    const ticketList = await tickets.find({
        category,
        title: { $regex: title, $options: "i" },
        "reports.count": { $lte: 10 },
        "coordinates.lat": { $gte: lat - dist, $lte: lat + dist },
        "coordinates.long": { $gte: long - dist, $lte: long + dist },
        status
    }).select("-activity -reports");

    return res.json(ticketList.map(ticket => ticket.toJSON()));
})

router.get("/:id", async (req, res) => {
    const ticket = await tickets.findById(req.params.id).select("-reports");
    if (!ticket) {
        return res.status(404).json({ error: "Ticket not found" });
    }
    res.json(ticket.toJSON());
})

router.post("/create", upload.array("photos", 5), async (req, res) => {
    const { title, description, category, anonymous, assignedTo, coordinates } = req.body;
    const photos = req.files;

    let reporter;

    if (anonymous) reporter = "anonymous";
    else {
        const sessionId = req.cookies.session_id;
        const session = await sessions.findOne({ _id: sessionId });
        if (!session)
            return res.status(401).json({ error: "Unauthorized" });
        const user = await users.findOne({ email: session.email });
        if (user.banned) {
            return res.status(403).json({ error: "User is banned" });
        }
        reporter = session.email;
    }

    if (!title || !description || !reporter)
        return res.status(400).json({ error: "Title, description, and reporter are required" });

    const newTicket = new tickets({
        title,
        description,
        category,
        assignedTo,
        coordinates,
        reporter
    });

    newTicket.activity.push({
        action: "create",
        user: newTicket.reporter,
        timestamp: new Date(),
        comment: `Ticket created by ${newTicket.reporter}`,
    });

    res.status(201).json(newTicket.toJSON());

    await sendEmail(
        makeIssueMail(
            "noreply@civictrack.org",
            newTicket.reporter,
            newTicket.title,
            newTicket.category
        )
    )

    const photoUrls = [];

    for (const photo of photos) {
        const uploadResult = await cloudinary.uploader.upload(photo.path);
        photoUrls.push(cloudinary.url(uploadResult.public_id));
    }

    newTicket.photos = photoUrls;
    newTicket.markModified("photos");
    newTicket.save();
})

router.delete("/delete/:id", async (req, res) => {
    const sessionId = req.cookies.session_id;
    const session = await sessions.findOne({ _id: sessionId });
    if (!session) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const ticket = await tickets.findById(req.params.id);
    if (!ticket) {
        return res.status(404).json({ error: "Ticket not found" });
    }

    const user = await users.findOne({ email: session.email });
    if (ticket.reporter !== user.email && user.role !== "admin") {
        return res.status(403).json({ error: "Forbidden" });
    }

    await tickets.deleteOne({ _id: ticket._id });
    res.json({ message: "Ticket deleted successfully" });
})

router.put("/set-status/:id", async (req, res) => {
    // Auth
    const sessionId = req.cookies.session_id;
    const session = await sessions.findOne({ _id: sessionId });
    if (!session) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const ticket = await tickets.findById(req.params.id);
    if (!ticket) {
        return res.status(404).json({ error: "Ticket not found" });
    }

    const user = await users.findOne({ email: session.email });
    if (user.role !== "admin") {
        return res.status(403).json({ error: "Forbidden" });
    }

    // Actual logic
    const { status } = req.body;
    if (!status) {
        return res.status(400).json({ error: "Status is required" });
    }

    if (status && !["open", "in-progress", "closed"].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
    }

    ticket.status = status;
    ticket.activity.push({
        action: "status-update",
        user: user.email,
        timestamp: new Date(),
        comment: `Status updated to ${status} by ${user.email}`,
    });

    await ticket.save();
    res.json(ticket.toJSON());

    sendEmail(
        makeUpdateMail(
            "noreply@civictrack.org",
            ticket.reporter,
            ticket.title,
            ticket.status
        )
    )
})

router.put("/set-location/:id", async (req, res) => {
    const sessionId = req.cookies.session_id;
    const session = await sessions.findOne({ _id: sessionId });
    if (!session) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const ticket = await tickets.findById(req.params.id);
    if (!ticket) {
        return res.status(404).json({ error: "Ticket not found" });
    }

    const user = await users.findOne({ email: session.email });
    if (ticket.reporter !== user.email && user.role !== "admin") {
        return res.status(403).json({ error: "Forbidden" });
    }

    const { lat, long } = req.body.coordinates;
    if (!lat || !long) {
        return res.status(400).json({ error: "Coordinates are required" });
    }
    ticket.coordinates = { lat, long };
    await ticket.save();
    res.json(ticket.toJSON());
});

router.put("/update/:id", async (req, res) => {
    const sessionId = req.cookies.session_id;
    const session = await sessions.findOne({ _id: sessionId });
    if (!session) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const ticket = await tickets.findById(req.params.id);
    if (!ticket) {
        return res.status(404).json({ error: "Ticket not found" });
    }

    if (ticket.reporter !== session.email) {
        return res.status(403).json({ error: "Forbidden" });
    }

    const { title, description, category } = req.body;

    ticket.category = category || ticket.category;
    if (category && !["roads", "lighting", "obstructions", "public-safety", "cleanliness", "water-supply", "other"].includes(category)) {
        return res.status(400).json({ error: "Invalid category" });
    }

    ticket.title = title || ticket.title;
    ticket.description = description || ticket.description;

    ticket.activity.push({
        action: "update",
        user: ticket.reporter,
        timestamp: new Date(),
        comment: `Ticket updated by ${ticket.reporter}`,
    });

    await tickets.updateOne({ _id: ticket._id }, {
        $set: {
            title: ticket.title,
            description: ticket.description,
            category: ticket.category
        }
    });
    res.json(ticket.toJSON());
})

router.post("/:id/report", async (req, res) => {
    const ticket = await tickets.findById(req.params.id);
    if (!ticket) return res.status(404).json({ error: "Ticket not found" });

    const { comment } = req.body;
    if (!comment) {
        return res.status(400).json({ error: "Comment is required" });
    }
    ticket.reports.count += 1;
    ticket.reports.comments.push(comment);

    ticket.markModified("reports.comments");

    await ticket.save();
    res.json(ticket.toJSON());
})

export default router;