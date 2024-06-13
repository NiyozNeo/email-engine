import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { OidcStrategy } from "./oidc.strategy";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { PrismaModule } from "src/prisma/prisma.module";
import { ConfigModule } from "@nestjs/config";

@Module({
	imports: [PassportModule, ConfigModule, PrismaModule],
	providers: [AuthService, OidcStrategy],
	controllers: [AuthController],
})
export class AuthModule {}
