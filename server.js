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
               <p>Thank you for choosing <b>Hotel Black Diamond </b>
                for your upcoming stay. We are delighted to confirm your reservation and lookung forward to providing you with acomfortable and memorable experience. Below are the details of your booking:</p>
               <p><strong>Details:</strong></p>
               <ul>
               <li><b>Phone:</b> ${phone}</li>
               <li><b>Check-in:</b> ${checkin}</li>
               <li><b>Check-out:</b> ${checkout}</li>
               <li><b>Room Type:</b> ${roomType}</li>
               </ul>
               <p>Best Regards,</p>
               <p>Hotel Black Diamond</p>
               
               <p>We look forward to hosting you</p>`
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
const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at port ${PORT}`);
});

