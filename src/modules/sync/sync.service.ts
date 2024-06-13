import { Injectable } from '@nestjs/common';
import axios from 'axios';
// import { MyElasticsearchService } from '../elasticsearch/elasticseach.service';

@Injectable()
export class SyncService {
  private readonly graphApiUrl = 'https://graph.microsoft.com/v1.0';

  constructor(
    // private readonly elasticsearchService: MyElasticsearchService,
  ) {}

  async syncEmails(accessToken: string): Promise<void> {
    const response = await axios.get(`${this.graphApiUrl}/me/mailFolders/inbox/messages`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const emails = response.data.value;

    for (const email of emails) {
      const emailData = {
        subject: email.subject,
        sender: email.from.emailAddress.address,
        received_date: email.receivedDateTime,
        body: email.body.content,
      };

      // await this.elasticsearchService.indexEmail(email.id, emailData);
    }
  }
}
