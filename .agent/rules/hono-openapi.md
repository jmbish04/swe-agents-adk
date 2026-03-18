Every exposed Hono app instance must use OpenAPIHono. Standard Hono classes are prohibited for public APIs.

Payloads MUST be validated by Zod at the route declaration boundary via the request.body.content schema block.

You must always output OpenAPI 3.1.0 via app.doc31().

Complex inserts affecting more than 2 related tables at once must use db.batch() to prevent cascading fetch-latency issues against D1.
