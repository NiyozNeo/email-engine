// auth.provider.ts

import { Injectable, Inject } from "@nestjs/common";
import axios from "axios";
import * as msal from "@azure/msal-node";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "src/prisma/prisma.service";
import * as graph from "@microsoft/microsoft-graph-client";

@Injectable()
export class AuthService {
	private msalConfig: any;
	private cryptoProvider: any;

	constructor(
		private configService: ConfigService,
		private prisma: PrismaService,
	) {
		this.msalConfig = {
			auth: {
				clientId: this.configService.get<string>("CLIENT_ID"),
				authority:
					this.configService.get<string>("CLOUD_INSTANCE") +
					this.configService.get<string>("TENANT_ID") +
					"/",
				clientSecret: this.configService.get<string>("CLIENT_SECRET"),
				redirectUri: this.configService.get<string>("REDIRECT_URI"),
				postLogoutRedirectUri: this.configService.get<string>(
					"POST_LOGOUT_REDIRECT_URI",
				),
			},
			system: {
				loggerOptions: {
					loggerCallback(loglevel, message, containsPii) {
						console.log(message);
					},
					piiLoggingEnabled: false,
					logLevel: msal.LogLevel.Verbose,
				},
			},
		};

		this.cryptoProvider = new msal.CryptoProvider();
	}

	async login(options: {
		scopes?: string[];
		redirectUri?: string;
		successRedirect?: string;
	}) {
		const state = this.cryptoProvider.base64Encode(
			JSON.stringify({
				successRedirect: options.successRedirect || "/",
			}),
		);

		const authCodeUrlRequestParams = {
			state: state,
			scopes: options.scopes || [],
			redirectUri:
				options.redirectUri || this.msalConfig.auth.redirectUri,
		};

		const authCodeRequestParams = {
			state: state,
			scopes: options.scopes || [],
			redirectUri:
				options.redirectUri || this.msalConfig.auth.redirectUri,
		};

		if (
			!this.msalConfig.auth.cloudDiscoveryMetadata ||
			!this.msalConfig.auth.authorityMetadata
		) {
			const [cloudDiscoveryMetadata, authorityMetadata] =
				await Promise.all([
					this.getCloudDiscoveryMetadata(
						this.msalConfig.auth.authority,
					),
					this.getAuthorityMetadata(this.msalConfig.auth.authority),
				]);

			this.msalConfig.auth.cloudDiscoveryMetadata = JSON.stringify(
				cloudDiscoveryMetadata,
			);
			this.msalConfig.auth.authorityMetadata =
				JSON.stringify(authorityMetadata);
		}

		const msalInstance = this.getMsalInstance();

		return this.redirectToAuthCodeUrl(
			authCodeUrlRequestParams,
			authCodeRequestParams,
			msalInstance,
		);
	}

	async acquireToken(options: {
		scopes?: string[];
		redirectUri?: string;
		successRedirect?: string;
	}) {
		return async (req, res, next) => {
			try {
				const msalInstance = this.getMsalInstance();

				if (req.tokenCache) {
					msalInstance.getTokenCache().deserialize(req.tokenCache);
				}

				const tokenResponse = await msalInstance.acquireTokenSilent({
					account: req.account,
					scopes: options.scopes || [],
				});

				req.tokenCache = msalInstance.getTokenCache().serialize();
				req.accessToken = tokenResponse.accessToken;
				req.idToken = tokenResponse.idToken;
				req.account = tokenResponse.account;

				res.redirect(options.successRedirect || "/");
			} catch (error) {
				if (error instanceof msal.InteractionRequiredAuthError) {
					return (
						await this.login({
							scopes: options.scopes || [],
							redirectUri:
								options.redirectUri ||
								this.msalConfig.auth.redirectUri,
							successRedirect: options.successRedirect || "/",
						})
					)(req, res, next);
				}

				next(error);
			}
		};
	}

	async handleRedirect(body: any) {
		if (!body || !body.state) {
			throw Error("Error: response not found");
		}

		const authCodeRequest = {
			...req.authCodeRequest,
			code: body.code,
			codeVerifier: pkceCodes.verifier,
		};

		try {
			const msalInstance = this.getMsalInstance();

			if (req.tokenCache) {
				msalInstance.getTokenCache().deserialize(req.tokenCache);
			}

			const tokenResponse = await msalInstance.acquireTokenByCode(
				authCodeRequest,
				body,
			);

			req.tokenCache = msalInstance.getTokenCache().serialize();
			req.idToken = tokenResponse.idToken;
			req.account = tokenResponse.account;
			req.isAuthenticated = true;

			const state = JSON.parse(
				this.cryptoProvider.base64Decode(body.state),
			);

			return state.successRedirect || "/";
		} catch (error) {
			console.log(error);
		}
	}

	logout(options: { postLogoutRedirectUri?: string }) {
		return (req, res, next) => {
			let logoutUri = `${this.msalConfig.auth.authority}/oauth2/v2.0/`;

			if (options.postLogoutRedirectUri) {
				logoutUri += `logout?post_logout_redirect_uri=${options.postLogoutRedirectUri}`;
			}

			req.session.destroy(() => {
				res.redirect(logoutUri);
			});
		};
	}

	private getMsalInstance() {
		return new msal.ConfidentialClientApplication(this.msalConfig);
	}

	private async getCloudDiscoveryMetadata(authority: string) {
		const endpoint =
			"https://login.microsoftonline.com/common/discovery/instance";

		try {
			const response = await axios.get(endpoint, {
				params: {
					"api-version": "1.1",
					authorization_endpoint: `${authority}oauth2/v2.0/authorize`,
				},
			});

			return response.data;
		} catch (error) {
			console.log(error, "error");

			throw error;
		}
	}

	private async getAuthorityMetadata(authority: string) {
		const endpoint = `${authority}/v2.0/.well-known/openid-configuration`;

		try {
			const response = await axios.get(endpoint);
			return response.data;
		} catch (error) {
			throw error;
		}
	}

	async redirectToAuthCodeUrl(
		authCodeUrlRequestParams,
		authCodeRequestParams,
		msalInstance,
	) {
		const { verifier, challenge } =
			await this.cryptoProvider.generatePkceCodes();

		const authCodeUrlRequest = {
			...authCodeUrlRequestParams,
			responseMode: msal.ResponseMode.FORM_POST,
			codeChallenge: challenge.challenge,
			codeChallengeMethod: "S256",
		};

		try {
			const authCodeUrlResponse =
				await msalInstance.getAuthCodeUrl(authCodeUrlRequest);

			console.log(authCodeUrlResponse, "authCodeUrlResponse");

			return authCodeUrlResponse;
		} catch (error) {
			console.log(error, "error");
		}
	}

	async validateUser(profile: any): Promise<any> {
		// Implement validation logic for the user profile
		// For example, check if the user already exists in the database
		const existingUser = await this.prisma.user.findUnique({
			where: { outlookId: profile.id },
		});
		if (existingUser) {
			return existingUser;
		} else {
			// If the user does not exist, create a new user
			return this.prisma.user.create({
				data: {
					outlookId: profile.id,
					email: profile.emails[0].value,
					// Add other relevant user data
				},
			});
		}
	}

	async getUserDetails(msalClient, userId) {
		const client = this.getAuthenticatedClient(msalClient, userId);

		const user = await client
			.api("/me")
			.select("displayName,mail,mailboxSettings,userPrincipalName")
			.get();
		return user;
	}

	getAuthenticatedClient(msalClient, userId) {
		if (!msalClient || !userId) {
			throw new Error(
				`Invalid MSAL state. Client: ${msalClient ? "present" : "missing"}, User ID: ${userId ? "present" : "missing"}`,
			);
		}

		// Initialize Graph client
		const client = graph.Client.init({
			// Implement an auth provider that gets a token
			// from the app's MSAL instance
			authProvider: async (done) => {
				try {
					// Get the user's account
					const account = await msalClient
						.getTokenCache()
						.getAccountByHomeId(userId);

					if (account) {
						// Attempt to get the token silently
						// This method uses the token cache and
						// refreshes expired tokens as needed
						const scopes =
							process.env.OAUTH_SCOPES ||
							"https://graph.microsoft.com/.default";
						const response = await msalClient.acquireTokenSilent({
							scopes: scopes.split(","),
							redirectUri: process.env.OAUTH_REDIRECT_URI,
							account: account,
						});

						// First param to callback is the error,
						// Set to null in success case
						done(null, response.accessToken);
					}
				} catch (err) {
					console.log(
						JSON.stringify(err, Object.getOwnPropertyNames(err)),
					);
					done(err, null);
				}
			},
		});

		return client;
	}
}
