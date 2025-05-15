import type { FastifyInstance } from "fastify";

export async function routes(app: FastifyInstance) {
	app.get(
		"/ping",
		{
			schema: {
				description: "Ping the server",
				tags: ["healthcheck"],
				summary: "Ping",
				response: {
					200: {
						type: "object",
						properties: {
							pong: { type: "string" },
						},
					},
				},
			},
		},
		async (request, reply) => {
			return { pong: "it worked!" };
		},
	);

	app.get("/openapi.json", async (request, reply) => {
		return app.swagger();
	});
}
