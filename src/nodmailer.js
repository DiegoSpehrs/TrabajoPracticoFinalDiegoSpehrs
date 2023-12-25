import nodemailer from 'nodemailer';
import config from './config.js';

export const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user:config.gmail_user,
        pass:config.gmail_password
    }
});