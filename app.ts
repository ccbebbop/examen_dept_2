import { Application } from "https://deno.land/x/oak@v12.4.0/application.ts";
import { Status } from "https://deno.land/x/oak@v12.4.0/deps.ts";
import { isHttpError } from "https://deno.land/x/oak@v12.4.0/deps.ts";

import { viewEngine } from "https://deno.land/x/view_engine@v10.6.0/mod.ts";
import { oakAdapter } from "https://deno.land/x/view_engine@v10.6.0/mod.ts";
import { dejsEngine } from "https://deno.land/x/view_engine@v10.6.0/mod.ts";
import { type ViewConfig } from "https://deno.land/x/view_engine@v10.6.0/mod.ts";

import { router } from "./routes/routes.ts";

const viewConfig: ViewConfig = {
	viewRoot: 'views'
}

const port = Number(Deno.env.get('PORT')) || 8000;
const app = new Application();

app.use(
	viewEngine(
		oakAdapter,
		dejsEngine,
		viewConfig,
	)
);

app.use(async (ctx, next) => {
	try {
		await next();
	} catch (err) {
		if (isHttpError(err)) {
			switch (err.status) {
				case Status.NotFound:
					await ctx.render("pages-error404.ejs");
					break;
				
				case Status.InternalServerError:	
					await ctx.render("pages-error500.ejs");
					break;
				default:
					throw(err);
			}
		} else {
			throw err;
		}
	}
}
);

app.use(
	router.routes()
);

app.use(async (ctx) => {
	await ctx.send({
		root: `${Deno.cwd()}/static/vristo-html-main`,
	})
})

app.listen({port: port});

app.addEventListener('listen', ({ hostname, port, secure }) => {
	console.log(
		`Listening on: ${secure ? "https://" : "http://"}${
		hostname ?? "localhost"
		}:${port}`,
	);
});

