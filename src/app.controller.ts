import { Controller, Get, Render, Session } from "@nestjs/common";

@Controller()
export class AppController {
	@Get()
	@Render("index")
	root(@Session() session: Record<string, any>) {
		return {
			title: "MSAL Node & Express Web App",
			isAuthenticated: session?.isAuthenticated,
			username: session?.account?.username,
		};
	}
}
