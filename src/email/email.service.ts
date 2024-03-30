import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}
  public async resetPassword(recipient: string, body: string): Promise<any> {
    await this.mailerService
      .sendMail({
        to: recipient, // list of receivers
        from: 'AbdulRahman <AbdulrahmanSharief2@gmail.com>', // sender address
        subject: 'Testing Nest MailerModule ✔', // Subject line
        text: body, // plaintext body
        html: `<b>${body}</b>`, // HTML body content
      })
      .then((info) => {
        console.log('email sent: ', info.response);
      })
      .catch((e) => {
        console.log('ERROR: ', e);
      });
  }
  public async verficationToken(recipient: string, body: string): Promise<any> {
    await this.mailerService
      .sendMail({
        to: recipient, // list of receivers
        from: 'AbdulRahman <AbdulrahmanSharief2@gmail.com>', // sender address
        subject: 'Verifiy Your Email.', // Subject line
        text: body, // plaintext body
        html: `<a href=${body}>Verify Your Email, valid for 24 hours.</a>`, // HTML body content
      })
      .then((info) => {
        console.log('email sent: ', info.response);
      })
      .catch((e) => {
        console.log('ERROR: ', e);
      });
  }
}
