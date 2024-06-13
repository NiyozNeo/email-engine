import { Module } from "@nestjs/common";
import { ElasticsearchModule } from "@nestjs/elasticsearch";
import { ConfigModule, ConfigService } from "@nestjs/config"; // Import ConfigModule and ConfigService
import { MyElasticsearchService } from "./elasticseach.service";

@Module({
  imports: [
    ConfigModule, // Import ConfigModule here
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule], // Import ConfigModule for async registration
      useFactory: async (configService: ConfigService) => ({
        node: configService.get("ELASTICSEARCH_NODE"),
        auth: {
          username: configService.get("ELASTICSEARCH_USERNAME"),
          password: configService.get("ELASTICSEARCH_PASSWORD"),
        },
      }),
      inject: [ConfigService], // Inject ConfigService into useFactory
    }),
  ],
  providers: [MyElasticsearchService],
  exports: [MyElasticsearchService],
})
export class MyElasticsearchModule {}
