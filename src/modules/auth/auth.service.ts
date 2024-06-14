// auth.provider.ts

import { Injectable, Inject } from "@nestjs/common";
import axios from "axios";
import * as msal from "@azure/msal-node";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "src/prisma/prisma.service";
import * as graph from "@microsoft/microsoft-graph-client";
import { NextFunction } from "express";

import { AuthorizationCodePayload } from "@azure/msal-common"; // Adjust the import path if needed

export interface AuthOptions {
    successRedirect?: string;
    scopes?: string[];
    redirectUri?: string;
    postLogoutRedirectUri?: string;
}

export interface ExtendedRequest extends Request {
    session: {
		destroy(arg0: () => void): unknown;
        tokenCache?: string;
        accessToken?: string;
        idToken?: string;
        account?: any;
        pkceCodes?: {
            verifier: string;
            challenge: string;
            challengeMethod: string;
        };
        authCodeRequest?: any;
        authCodeUrlRequest?: any;
        isAuthenticated?: boolean;
    };
    body: any;
}

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

	async login(req: ExtendedRequest, res: Response, next: NextFunction, options: AuthOptions = {}) {
		const msalInstance = this.getMsalInstance(this.msalConfig);
        if (req.session.tokenCache) {
            msalInstance.getTokenCache().deserialize(req.session.tokenCache);
        }

        const authCodeRequest = {
            account: req.session.account,
            scopes: options.scopes || [],
            redirectUri: options.redirectUri,
            code: ''
        };

        try {
            const tokenResponse = await msalInstance.acquireTokenByCode(authCodeRequest, req.body as AuthorizationCodePayload);

            req.session.tokenCache = msalInstance.getTokenCache().serialize();
            req.session.accessToken = tokenResponse.accessToken;
            req.session.idToken = tokenResponse.idToken;
            req.session.account = tokenResponse.account;
            req.session.isAuthenticated = true;

            res.redirect(options.successRedirect || '/');
        } catch (error) {
            next(error);
        }
    }

	async acquireToken(req: ExtendedRequest, res: Response, next: NextFunction, options: AuthOptions = {}) {
        if (!req.body || !req.body.state) {
            return next(new Error('State not found in request'));
        }

        const authCodeRequest = {
            ...req.session.authCodeRequest,
            code: req.body.code,
            codeVerifier: req.session.pkceCodes.verifier,
        };

		const msalInstance = this.getMsalInstance(this.msalConfig);

        if (req.session.tokenCache) {
            msalInstance.getTokenCache().deserialize(req.session.tokenCache);
        }

        try {
            const tokenResponse = await msalInstance.acquireTokenByCode(authCodeRequest, req.body as AuthorizationCodePayload);

            req.session.tokenCache = msalInstance.getTokenCache().serialize();
            req.session.idToken = tokenResponse.idToken;
            req.session.account = tokenResponse.account;
            req.session.isAuthenticated = true;

            const state = JSON.parse(this.cryptoProvider.base64Decode(req.body.state!));
            res.redirect(state.successRedirect);
        } catch (error) {
            next(error);
        }
    }

	async handleRedirect(req: ExtendedRequest, res: Response, next: NextFunction) {
        // Implement the logic to handle the redirect
        // This method is called when the user is redirected back to the application
        // after authentication

        if (!req.body || !req.body.state) {
            return next(new Error('State not found in request'));
        }

        const authCodeRequest = {
            ...req.session.authCodeRequest,
            code: req.body.code,
            codeVerifier: req.session.pkceCodes.verifier,
        };

		const msalInstance = this.getMsalInstance(this.msalConfig);

        if (req.session.tokenCache) {
            msalInstance.getTokenCache().deserialize(req.session.tokenCache);
        }

        try {
            const tokenResponse = await msalInstance.acquireTokenByCode(authCodeRequest, req.body as AuthorizationCodePayload);

            req.session.tokenCache = msalInstance.getTokenCache().serialize();
            req.session.accessToken = tokenResponse.accessToken;
            req.session.idToken = tokenResponse.idToken;
            req.session.account = tokenResponse.account;
            req.session.isAuthenticated = true;

            const state = JSON.parse(this.cryptoProvider.base64Decode(req.body.state!));
            res.redirect(state.successRedirect);
        } catch (error) {
            next(error);
        }
    }

	async logout(req: ExtendedRequest, res: Response, next: NextFunction, options: AuthOptions = {}) {
		const msalInstance = this.getMsalInstance(this.msalConfig);
        const logoutUri = msalInstance.clearCache(); // Adjust method name if necessary

        req.session.destroy(() => {
            res.redirect(logoutUri);
        });
    }

	getMsalInstance(msalConfig: msal.Configuration) {
		return new msal.ConfidentialClientApplication(msalConfig);
	}

	async getCloudDiscoveryMetadata(authority: string) {
		const endpoint =
			"https://login.microsoftonline.com/common/discovery/instance";

		try {
			const response = await axios.get(endpoint, {
				params: {
					"api-version": "1.1",
					authorization_endpoint: `${authority}/oauth2/v2.0/authorize`,
				},
			});

			return response.data;
		} catch (error) {
			throw error;
		}
	}

	async getAuthorityMetadata(authority: string) {
		const endpoint = `${authority}/.well-known/openid-configuration`;

		try {
			const response = await axios.get(endpoint);
			return response.data;
		} catch (error) {
			throw error;
		}
	}

	async getAuthCodeUrl(req: ExtendedRequest, res: Response, next: NextFunction, options: AuthOptions = {}) {
        req.session.pkceCodes = {
            verifier: 'your-verifier',
            challenge: 'your-challenge',
            challengeMethod: 'S256',
        };

		const msalInstance = this.getMsalInstance(this.msalConfig);

        req.session.authCodeUrlRequest = {
            redirectUri: options.redirectUri,
            scopes: options.scopes || [],
            codeChallenge: req.session.pkceCodes.challenge,
            codeChallengeMethod: req.session.pkceCodes.challengeMethod,
        };

        try {
            const authCodeUrlResponse = await msalInstance.getAuthCodeUrl(req.session.authCodeUrlRequest);
            res.redirect(authCodeUrlResponse);
        } catch (error) {
            next(error);
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
