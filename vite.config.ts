import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import path from "path";
import { watch_config } from "./src/watch";

export default defineConfig({
	plugins: [sveltekit(), watch_config()],
	resolve: {
		alias: {
			$src: path.resolve("./src"),
			$lib: path.resolve("./src/lib"),
			$assets: path.resolve(`./`),
		},
	},
});
