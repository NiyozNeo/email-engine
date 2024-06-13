import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./modules/auth/auth.module";
import { SyncModule } from "./modules/sync/sync.module";
import { MailModule } from "./modules/mail/mail.module";
import { MyElasticsearchModule } from "./modules/elasticsearch/elasticsearch.module";
import { CustomConfigModule } from "./config/config.module";

@Module({
	imports: [
		CustomConfigModule,
		AuthModule,
		MyElasticsearchModule,
		SyncModule,
		MailModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
