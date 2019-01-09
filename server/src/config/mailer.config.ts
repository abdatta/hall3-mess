import nodemailer from 'nodemailer';
import { UserModel } from '../models/user.model';

const SENDER = `"${ process.env.MAIL_SENDER }" <noreply@${ process.env.MAIL_HOST }>`;
const BCC = process.env.MAIL_BCC || '';

export class MailerConfig {

    public static setup() {
        return new Mailer({
            host: 'smtp.cc.iitk.ac.in',
            port: 465,
            secure: true, // use SSL
            auth: {
                user: process.env.MAIL_AUTH || '',
                pass: process.env.MAIL_PASS || ''
            }
        });
    }

}

export class Mailer {

    private transporter: nodemailer.Transporter;

    constructor(config: MailConfig) {
        // create reusable transporter object using the default SMTP transport
        this.transporter = nodemailer.createTransport(config);
    }

    private sendMail(mailOptions: nodemailer.SendMailOptions): Promise<any> {
        if (!process.env.MAIL_ENABLED) {
            console.log('Mail would have been sent to ' + mailOptions.to);
            console.log('Mail Payoad: ', JSON.stringify(mailOptions, null, 2));
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            this.transporter.sendMail(mailOptions, (error: any, info: any) => {
                if (error) {
                    reject(error);
                } else {
                    console.log('Mail sent to ' + mailOptions.to);
                    resolve(info);
                }
            });
        });
    }

    public sendAccountVerficationLink(user: UserModel, verifyLink: string, deregisterLink: string): Promise<any> {
        const mailOptions: nodemailer.SendMailOptions = {
            to: user.email,
            from: SENDER,
            bcc: BCC,
            subject: 'Account Verification Link',
            html: `<p>Hi ${ user.name } (${ user.rollno }),</p>` +
                  `<p>` +
                    `Thank you for signing up in the Mess Automation Portal, Hall 3. ` +
                    `Please verify your account using the following link:` +
                  `</p>` +
                  `<p><a href="${ verifyLink }">${ verifyLink }</a></p>` +
                  `<p>` +
                    `If you didn't signup, you can deregister your account using ` +
                    `<a href="${ deregisterLink }">this link</a>.` +
                  `</p>`
        };

        return this.sendMail(mailOptions);
    }

    public sendResetPasswordLink(to: string, rollno: string, resetLink: string): Promise<any> {
        const mailOptions: nodemailer.SendMailOptions = {
            to: to,
            from: SENDER,
            bcc: BCC,
            subject: 'Reset Password Link',
            html: `<p>` +
                    `The reset password link for your account with Roll No: ${ rollno } is given below:` +
                  `</p>` +
                  `<p><a href="${ resetLink }">${ resetLink }</a></p>` +
                  `<p>` +
                    `If you didn't request for reset password, kindly ignore this mail.` +
                  `</p>`
        };

        return this.sendMail(mailOptions);
    }

}

interface MailConfig {
    host: string;
    port: number;
    secure: boolean;
    auth: {
        user: string;
        pass: string;
    };
}