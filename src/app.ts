import Fastify, {
	type FastifyInstance,
	type RouteShorthandOptions,
} from "fastify";
import {
	type ZodTypeProvider,
	serializerCompiler,
	validatorCompiler,
} from "fastify-type-provider-zod";

const app: FastifyInstance = Fastify({}).withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(require("@fastify/cors"), {
	origin: "*",
});

const opts: RouteShorthandOptions = {
	schema: {
		response: {
			200: {
				type: "object",
				properties: {
					pong: {
						type: "string",
					},
				},
			},
		},
	},
};

app.get("/ping", opts, async (request, reply) => {
	return { pong: "it worked!" };
});

const start = async () => {
	try {
		await app.listen({ port: 3000 });

		const address = app.server.address();
		const port = typeof address === "string" ? address : address?.port;
	} catch (err) {
		app.log.error(err);
		process.exit(1);
	}
};

start();
