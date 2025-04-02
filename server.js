require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

// Serve static frontend
app.use(express.static(path.join(__dirname, 'public')));

// Temporary storage (optional, resets when server restarts)
let bookings = [];

// Email Sending Route
app.post('/send-email', async (req, res) => {
    const { name, email, phone, checkin, checkout, roomType } = req.body;
    
    // Store in temporary array (optional)
    bookings.push(req.body);

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Booking Confirmation',
        html: `<p>Hello ${name},</p>
               <p>Your booking is confirmed.</p>
               <p><b>Check-in:</b> ${checkin}<br>
               <b>Check-out:</b> ${checkout}<br>
               <b>Room Type:</b> ${roomType}</p>
               <p>Thank you!</p>`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ message: 'Booking confirmed! Check your email.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error sending email' });
    }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running at PORT:${PORT}`);
});
