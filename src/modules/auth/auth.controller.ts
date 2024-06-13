// auth.controller.ts

import { Controller, Get, Post, Req, Res, Next, Body } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ConfigService } from "@nestjs/config";

@Controller("auth")
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private configService: ConfigService,
	) {}

	@Get("signin")
	async login(@Res() res: any) {
		console.log("login");

		const data = await this.authService.login({
			scopes: [],
			redirectUri: this.configService.get("REDIRECT_URI"),
			successRedirect: "/",
		});

		res.redirect(data);
	}

	@Get("acquireToken")
	async acquireToken(@Req() req, @Res() res, @Next() next) {
		return (
			await this.authService.acquireToken({
				scopes: ["User.Read"],
				successRedirect: "/users/profile",
			})
		)(req, res, next);
	}

	@Post("redirect")
	async handleRedirect(@Body() body, @Res() res, @Next() next) {
		return await this.authService.handleRedirect(body);
	}

	// @Get("signout")
	// async logout(@Req() req, @Res() res, @Session() session) {
	// 	return this.authService.logout({})(req, res);
	// }
}
