import { Router } from 'express';
import nodemailer from 'nodemailer';

const emailRouter = Router();

emailRouter.post('/send', async (req, res) => {
  const { recipient, subject, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
        host: 'smtp-mail.outlook.com',
        port: 587,
        secure: false
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipient,
      subject: subject,
      text: message,
    };
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully!' });
    console.log('success')
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email.' });
  }
});

export default emailRouter;  