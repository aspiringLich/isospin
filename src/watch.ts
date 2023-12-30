import { watch } from "fs";
import { exec } from "child_process";
import { throttle } from "./lib/utils";
import type { ResolvedConfig } from "vite";

export function watch_config() {
	return {
		name: "watch-config",
		configResolved(config: ResolvedConfig) {
			config.logger.info(
				"[watch-config]: It is recommended you use `venv` for the python environment."
			);
			if (config.command === "serve") {
				watch_windowgen(config);
			}
		},
	};
}

function watch_windowgen(config: ResolvedConfig) {
	watch(
		"src/components/window/gen/config.yml",
		throttle(() => {
			config.logger.info("Regenerating window registry...");
			exec("python src/components/window/gen/gen_registry.py", (error, stdout, stderr) => {
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
