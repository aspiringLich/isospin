import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import path from "path";
import { watch_config } from "./src/watch";
import aliases from "./alias.json" assert { type: "json" };

let alias: { [key: string]: string } = {};
for (const [key, value] of Object.entries(aliases)) {
	alias[key] = path.resolve(value);
}

export default defineConfig({
	plugins: [sveltekit(), watch_config()],
	resolve: {
		alias,
	},
});
