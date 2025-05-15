import cors from "@fastify/cors";
import Fastify, {
	type FastifyInstance,
	type FastifyReply,
	type FastifyRequest,
	type RouteShorthandOptions,
} from "fastify";

import {
	type ZodTypeProvider,
	serializerCompiler,
	validatorCompiler,
} from "fastify-type-provider-zod";

import fastifySwagger from "@fastify/swagger";
import ScalarApiReference from "@scalar/fastify-api-reference";
import { routes } from "./routes.js";

const app: FastifyInstance = Fastify({
	logger: true,
}).withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

await app.register(cors, {
	origin: "*",
});

await app.register(fastifySwagger, {
	openapi: {
		info: {
			title: "My Fastify App",
			version: "1.0.0",
		},
		components: {
			securitySchemes: {
				apiKey: {
					type: "apiKey",
					name: "apiKey",
					in: "header",
				},
			},
		},
	},
});

await app.register(ScalarApiReference, {
	routePrefix: "/reference",
	// Additional hooks for the API reference routes. You can provide the onRequest and preHandler hooks
	hooks: {
		onRequest: (
			request: FastifyRequest,
			reply: FastifyReply,
			done: () => void,
		) => {
			done();
		},
		preHandler: (
			request: FastifyRequest,
			reply: FastifyReply,
			done: () => void,
		) => {
			done();
		},
	},
});

await app.register(routes);

const start = async () => {
	try {
		await app.listen({ port: 3000 });

		const address = app.server.address();
		const port = typeof address === "string" ? address : address?.port;
		app.log.info(`🔥 Server listening at http://localhost:${port}`);
		console.log(`🔥 Server listening at http://localhost:${port}`);
	} catch (err) {
		app.log.error(err);
		console.error(err);
		process.exit(1);
	}
};

await app.ready();

start();
