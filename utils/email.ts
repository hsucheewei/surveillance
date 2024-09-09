import { createTransport, Transporter } from 'nodemailer';

export function setupEmail(senderEmail: string, password: string) {

    const transporter = createTransport({
        service: 'gmail',
        auth: {
            user: senderEmail,
            pass: password
        }
    });

    return transporter;
}

export async function triggerEmail(transporter: Transporter, senderEmail: string, receiverEmail: string, subject: string, text: string) {
    const mailOptions = {
        from: senderEmail,
        to: receiverEmail,
        subject: subject,
        text: text
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch(error) {
        throw new Error('Error sending email');
    }
} 