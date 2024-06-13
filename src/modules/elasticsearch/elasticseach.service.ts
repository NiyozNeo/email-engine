import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class MyElasticsearchService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async indexEmail(emailId: string, emailData: any): Promise<any> {
    return this.elasticsearchService.index({
      index: 'emails',
      id: emailId,
      document: emailData,
    });
  }

  async searchEmails(query: string): Promise<any> {
    return this.elasticsearchService.search({
      index: 'emails',
      body: {
        query: {
          multi_match: {
            query: query,
          },
        },
      },
    });
  }

  async getEmailById(emailId: string): Promise<any> {
    return this.elasticsearchService.get({
      index: 'emails',
      id: emailId,
    });
  }
}
