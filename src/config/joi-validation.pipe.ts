import "dotenv/config";

export type NodeEnv = "development" | "production";

import * as Joi from "joi";

export const JoiValidationPipe = Joi.object({
	NODE_ENV: Joi.string()
		.valid("development", "production", "test")
		.default("development"),

	SERVER_PORT: Joi.number().required(),

	DATABASE_URL: Joi.string().required(),
	CLOUD_INSTANCE: Joi.string().required(),
	TENANT_ID: Joi.string().required(),
	CLIENT_ID: Joi.string().required(),
	CLIENT_SECRET: Joi.string().required(),
	REDIRECT_URI: Joi.string().required(),
	POST_LOGOUT_REDIRECT_URI: Joi.string().required(),
	GRAPH_API_ENDPOINT: Joi.string().required(),
	EXPRESS_SESSION_SECRET: Joi.string().required(),
	ELASTICSEARCH_NODE: Joi.string().required(),
	ELASTICSEARCH_USERNAME: Joi.string().required(),
	ELASTICSEARCH_PASSWORD: Joi.string().required(),
	API_VERSION: Joi.string().optional(),
});
