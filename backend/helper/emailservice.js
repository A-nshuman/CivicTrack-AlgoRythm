import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '✅ Loaded' : '❌ Missing');


// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_PASS, // Your generated App Password
    },
});

// Set up email data with unicode symbols
const mailOptions = {
    from: '"CivicTrack" <noreply@civictrack.org>',
    to: "user@example.com",
    subject: "📍 Your Issue Has Been Reported | CivicTrack",
    text: `Hello,

Thank you for reporting a civic issue in your area.

📝 Issue Summary:
Title: [Your Issue Title]
Category: [Selected Category]
Status: Reported

Your report helps make your neighborhood better. Our local authorities or community moderators will review the issue soon.

You’ll be notified when the status of your report changes.

You can view or manage your report by visiting the CivicTrack app.

—
CivicTrack Team`,
    html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
            <h2 style="color: #2c3e50;">📍 Your Report Has Been Received</h2>
            <p>Thank you for taking the time to report a civic issue in your neighborhood.</p>
            <h4>📝 Issue Summary:</h4>
            <ul>
                <li><strong>Title:</strong> [Your Issue Title]</li>
                <li><strong>Category:</strong> [Selected Category]</li>
                <li><strong>Status:</strong> Reported</li>
            </ul>
            <p>Your report contributes to building a cleaner, safer, and better community.</p>
            <p>Our local authorities or moderators will review the issue shortly.</p>
            <p>You will receive updates as the status changes.</p>
            <br/>
            <p>—<br/>CivicTrack Team</p>
        </div>
    `
};
const mailOptions2 = {
    from: '"CivicTrack" <noreply@civictrack.org>',
    to: "user@example.com",
    subject: "🔔 Update on Your Reported Issue | CivicTrack",
    text: `Hello,

There’s an update on the issue you reported:

📝 Issue: [Your Issue Title]
📌 New Status: [Updated Status: In Progress / Resolved]
⏱ Updated At: [Date & Time]

Thank you for helping improve your neighborhood. You can track the issue on the CivicTrack map or contact support for further info.

—
CivicTrack Team`,
    html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
            <h2 style="color: #2980b9;">🔔 Your Issue Has Been Updated</h2>
            <p>There’s a new update on the civic issue you reported:</p>
            <ul>
                <li><strong>Issue:</strong> [Your Issue Title]</li>
                <li><strong>New Status:</strong> [Updated Status: In Progress / Resolved]</li>
                <li><strong>Updated At:</strong> [Date & Time]</li>
            </ul>
            <p>Thank you for being an active part of your community.</p>
            <p>You can check the issue status or view it on the map in the CivicTrack app.</p>
            <br/>
            <p>—<br/>CivicTrack Team</p>
        </div>
    `
};


// Send the email
async function sendEmail() {
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    } catch (error) {
        console.error("Failed to send email:", error);
    }
}

sendEmail();