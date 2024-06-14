// auth.controller.ts

import { Controller, Get, Post, Req, Res, Next, Body } from "@nestjs/common";
import { AuthService, ExtendedRequest } from "./auth.service";
import { ConfigService } from "@nestjs/config";
import { NextFunction } from "express";

@Controller("auth")
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private configService: ConfigService,
	) {}

	@Get('signin')
    async signIn(
        @Req() req: ExtendedRequest,
        @Res() res: Response,
        @Next() next: NextFunction,
    ) {
        await this.authService.login(req, res, next, {
            scopes: [],
            redirectUri: process.env.REDIRECT_URI,
            successRedirect: '/',
        });
    }

    @Get('acquireToken')
    async acquireToken(
        @Req() req: ExtendedRequest,
        @Res() res: Response,
        @Next() next: NextFunction,
    ) {
        await this.authService.acquireToken(req, res, next, {
            scopes: ['User.Read'],
            redirectUri: process.env.REDIRECT_URI,
            successRedirect: '/users/profile',
        });
    }

    @Post('redirect')
    async handleRedirect(
        @Req() req: ExtendedRequest,
        @Res() res: Response,
        @Next() next: NextFunction,
        @Body() body: any,
    ) {
        await this.authService.handleRedirect(req, res, next);
    }

    @Get('signout')
    async signOut(
        @Req() req: ExtendedRequest,
        @Res() res: Response,
        @Next() next: NextFunction,
    ) {
        await this.authService.logout(req, res, next, {
            postLogoutRedirectUri: process.env.POST_LOGOUT_REDIRECT_URI,
        });
    }
}
