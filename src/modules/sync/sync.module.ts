import { Module } from '@nestjs/common';
import { SyncService } from './sync.service';
import { SyncController } from './sync.controller';
// import { MyElasticsearchModule } from '../elasticsearch/elasticsearch.module';

@Module({
  // imports: [MyElasticsearchModule],
  providers: [SyncService],
  controllers: [SyncController],
})
export class SyncModule {}
