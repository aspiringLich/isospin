import { watch } from "fs";
import { exec } from "child_process";
import { throttle } from "./lib/util";
import type { ResolvedConfig } from "vite";

export function watch_config() {
	return {
		name: "watch-config",
		configResolved(config: ResolvedConfig) {
			if (config.command === "serve") {
				watch_windowgen(config);
			}
		},
	};
}

function watch_windowgen(config: ResolvedConfig) {
	watch(
		"src/lib/window/gen/config.yml",
		throttle(() => {
			config.logger.info("Regenerating window registry...");
			exec("python src/lib/window/gen/gen_registry.py", (error, stdout, stderr) => {
				if (error) {
					config.logger.error(`gen_registry.py: ${error.message}`);
					return;
				}
				if (stderr) {
					config.logger.error(`gen_registry.py: ${stderr}`);
					return;
				}
			});
		}, 100)
	);
}
