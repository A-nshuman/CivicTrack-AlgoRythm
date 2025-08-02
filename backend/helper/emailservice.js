import nodemailer from "nodemailer";

const username = process.env.EMAIL_USER;
const password = process.env.EMAIL_PASS;
// if (!username || !password) {
//     throw new Error("Email credentials are not set in environment variables");
// }

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: username,
        pass: password,
    },
});

export function makeIssueMail(from, to, issueTitle, category) {
    return {
        from: '"CivicTrack" <noreply@civictrack.org>',
        to: "user@example.com",
        subject: "📍 Your Issue Has Been Reported | CivicTrack",
        text:
            "Hello,\n\n" +

            "Thank you for reporting a civic issue in your area.\n\n" +

            "📝 Issue Summary:\n" +
            `Title: ${issueTitle}\n` +
            `Category: ${category}\n` +
            `Status: Reported\n\n` +

            "Your report helps make your neighborhood better. Our local authorities or community moderators will review the issue soon.\n\n" +
            "You’ll be notified when the status of your report changes.\n\n" +
            "You can view or manage your report by visiting the CivicTrack app.\n\n",
        html: `
        < div style = "font-family: Arial, sans-serif; color: #333;" >
                <h2 style="color: #2c3e50;">📍 Your Report Has Been Received</h2>
                <p>Thank you for taking the time to report a civic issue in your neighborhood.</p>
                <h4>📝 Issue Summary:</h4>
                <ul>
                    <li><strong>Title:</strong> ${issueTitle}</li>
                    <li><strong>Category:</strong> ${category}</li>
                    <li><strong>Status:</strong> Reported</li>
                </ul>
                <p>Your report contributes to building a cleaner, safer, and better community.</p>
                <p>Our local authorities or moderators will review the issue shortly.</p>
                <p>You will receive updates as the status changes.</p>
                <br/>
                <p>—<br/>CivicTrack Team</p>
            </div >
        `
    };
}

export function makeUpdateMail(from, to, issueTitle, status) {
    return {
        from: '"CivicTrack" <noreply@civictrack.org>',
        to: "user@example.com",
        subject: "🔔 Update on Your Reported Issue | CivicTrack",
        text:
            "Hello,\n\n" +

            "There’s an update on the issue you reported:\n\n" +

            `📝 Issue: ${issueTitle}\n` +
            `📌 New Status: ${status}\n` +
            `⏱ Updated At: ${new Date().toLocaleString()}\n\n` +

            "Thank you for helping improve your neighborhood. You can track the issue on the CivicTrack map or contact support for further info.\n\n" +
            "—\nCivicTrack Team",
        html:
            `<div style="font-family: Arial, sans-serif; color: #333;">
            <h2 style="color: #2980b9;">🔔 Your Issue Has Been Updated</h2>
            <p>There’s a new update on the civic issue you reported:</p>
            <ul>
                <li><strong>Issue:</strong> ${issueTitle}</li>
                <li><strong>New Status:</strong> ${status}</li>
                <li><strong>Updated At:</strong> ${new Date().toLocaleString()}</li>
            </ul>
            <p>Thank you for being an active part of your community.</p>
            <p>You can check the issue status or view it on the map in the CivicTrack app.</p>
            <br/>
            <p>—<br/>CivicTrack Team</p>
        </div >`
    };
}

export async function sendEmail(mailOptions) {
    try {
        const info = await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Failed to send email:", error);
    }
}