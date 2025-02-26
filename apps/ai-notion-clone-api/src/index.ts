import { Hono } from 'hono';
import { cors } from 'hono/cors';

export type Bindings = {
	AI: Ai;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use(
	'/*',
	cors({
		origin: '*',
		allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests', 'Content-Type'],
		allowMethods: ['POST', 'GET', 'OPTIONS', 'PUT'],
		exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
		maxAge: 600,
		credentials: true,
	})
);

app.get('/', async () => {
	return new Response('Hello World');
});

app.post('/translate/', async (c) => {
	const { data, source, target } = await c.req.json<{ data: string; source: string; target: string }>();

	// Generate a summary of the text
	const summary = await c.env.AI.run('@cf/facebook/bart-large-cnn', {
		input_text: data,
		max_length: 1000,
	});

	// Translate the summary to the target language
	const translate = await c.env.AI.run('@cf/meta/m2m100-1.2b', {
		text: summary.summary,
		source_lang: source,
		target_lang: target,
	});

	return new Response(JSON.stringify(translate));
});

export default app;
