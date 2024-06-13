import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { join } from "path";
import { NestExpressApplication } from "@nestjs/platform-express";

import * as session from "express-session";

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);
	const configService = app.get(ConfigService);

	// somewhere in your initialization file
	app.use(
		session({
			secret: "my-secret",
			resave: false,
			saveUninitialized: false,
		}),
	);

	// app.use(passport.initialize());
	// app.use(passport.session());

	app.useStaticAssets(join(__dirname, "..", "public"));
	app.setBaseViewsDir(join(__dirname, "..", "views"));
	app.setViewEngine("hbs");
	await app.listen(configService.get("SERVER_PORT"));
	console.log(`Server is running on: ${await app.getUrl()}`);
}
bootstrap();
