const nodemailer = require('nodemailer');
require('dotenv').config();

const mailSender = async (email, title, body) => {
    try {
        // Create the transport to send emails
        let sender = nodemailer.createTransport({
            host: process.env.MAIL_HOST || 'smtp.gmail.com', // Default to Gmail SMTP
            port: 587,
            secure: false, // Use TLS
            auth: {
                user: process.env.MAIL_USER, // Your Gmail address
                pass: process.env.APP_PASS,   // Your App Password
            },
        });

        // Log the transport configuration for debugging
        // console.log('Transporter created with:', {
        //     host: process.env.MAIL_HOST,
        //     user: process.env.MAIL_USER,
        // });

        // Send emails to users
        let info = await sender.sendMail({
            from: `${process.env.MAIL_USER}`, 
            to: email,                        
            subject: title,                   
            html: body,                      
        });

        // console.log("Email info: ", info);
        return true;
    } catch (error) {
        console.log(`Unable to send mail in mailSender: ${error.message}`);
        return false
    }
};

module.exports = mailSender;
