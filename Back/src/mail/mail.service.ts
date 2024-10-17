import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private transporter;

    constructor() {
        // Configura el transporte de correo
        this.transporter = nodemailer.createTransport({
            host: 'smtp.example.com', // Cambia esto por tu proveedor de correo
            port: 587,
            secure: false, // true para el puerto 465, false para otros puertos
            auth: {
                user: 'your-email@example.com', // Tu correo electrónico
                pass: 'your-password', // Tu contraseña
            },
        });
    }

    async sendMail(to: string, subject: string, text: string) {
        const mailOptions = {
            from: 'your-email@example.com',
            to,
            subject,
            text,
        };

        await this.transporter.sendMail(mailOptions);
    }
}
