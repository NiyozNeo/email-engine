import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class MailService {
  private readonly graphApiUrl = 'https://graph.microsoft.com/v1.0';

  constructor() {}

  async sendEmail(accessToken: string, recipient: string, subject: string, content: string): Promise<void> {
    const emailData = {
      message: {
        subject: subject,
        body: {
          contentType: 'Text',
          content: content,
        },
        toRecipients: [
          {
            emailAddress: {
              address: recipient,
            },
          },
        ],
      },
    };

    await axios.post(`${this.graphApiUrl}/me/sendMail`, emailData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
  }
}
