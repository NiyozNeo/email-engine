import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { OIDCStrategy, VerifyCallback } from "passport-azure-ad";
import { AuthService } from "./auth.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class OidcStrategy extends PassportStrategy(
	OIDCStrategy,
	"azure_ad_oidc",
) {
	constructor(
		private readonly configService: ConfigService,
		private readonly authService: AuthService,
	) {
		super({
			identityMetadata: `https://login.microsoftonline.com/${configService.get("TENANT_ID")}/v2.0/.well-known/openid-configuration`,
			clientID: configService.get("CLIENT_ID"),
			responseType: "code",
			responseMode: "query",
			redirectUrl: configService.get("REDIRECT_URI"),
			clientSecret: configService.get("CLIENT_SECRET"),
			scope: [
				"profile",
				"offline_access",
				"user.read",
				"mail.read",
				"mail.send",
				"mail.readwrite",
			],
			passReqToCallback: true,
		});
	}

	async validate(req: any, profile: any, done: VerifyCallback): Promise<any> {
		const accessToken = req.headers.authorization.split(" ")[1];
		console.log(accessToken, done);

		return this.authService.validateUser(profile);
	}
}
