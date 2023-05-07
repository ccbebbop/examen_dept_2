import { Router } from "https://deno.land/x/oak@v10.6.0/router.ts";

const router = new Router();

router
	.get('/', async (ctx) => {
		await ctx.render("index.ejs");
	})
	.get('/productos', async (ctx) => {
		await ctx.render("products-table.ejs");
	})

export { router };
