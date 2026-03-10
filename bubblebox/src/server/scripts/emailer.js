import nodemailer from 'nodemailer'
import "../../strategies/local.js";
import express from 'express'


const { SMTP_URL } = process.env

const router = express.Router();

const defaultEmail = { from: 'bubbleboxnoreply@gmail.com' };

const sendEmail = (emailData, smtpUrl = SMTP_URL) => {
    const completeEmailData = Object.assign(defaultEmail, emailData)
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.NODEMAILER_USERNAME,
            pass: process.env.NODEMAILER_PASSWORD
        }

    })
    return transporter
        .sendMail(completeEmailData)
        .then(info => console.log(`Message sent: ${info.response}`))
        .catch(err => console.log(`Problem sending email: ${err}`))
}



export { sendEmail };
