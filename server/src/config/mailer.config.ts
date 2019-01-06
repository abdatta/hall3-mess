import nodemailer from 'nodemailer';

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

    private SENDER: string;
    private BCC: string;

    private transporter: nodemailer.Transporter;

    constructor(config: MailConfig) {
        this.SENDER = `"${ process.env.MAIL_SENDER }" <noreply@${ process.env.MAIL_HOST }>`;
        this.BCC = process.env.MAIL_BCC || '';

        // create reusable transporter object using the default SMTP transport
        this.transporter = nodemailer.createTransport(config);
    }

    private sendMail(mailOptions: nodemailer.SendMailOptions): Promise<any> {
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

    public sendAccountVerficationLink(to: string, verifyLink: string, deregisterLink: string): Promise<any> {
        const mailOptions: nodemailer.SendMailOptions = {
            to: to,
            from: this.SENDER,
            bcc: this.BCC,
            subject: 'Account Verification Link',
            html: `<p>` +
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
