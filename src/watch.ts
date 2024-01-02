import fs from "fs";
import { exec } from "child_process";
import { throttle } from "./lib/utils";
import type { ResolvedConfig } from "vite";
import { glob } from "glob";
import chokidar from "chokidar";

export function watch_config() {
	return {
		name: "watch-config",
		configResolved(config: ResolvedConfig) {
			config.logger.info(
				"[watch-config]: It is recommended you use `venv` for the python environment."
			);
			if (config.command === "serve") {
				watch({
					config,
					watch_path: "src/components/window/gen/config.yml",
					script_file: "src/components/window/gen/gen_registry.py",
					output_file: "src/components/window/registry.ts",
					msg: "Regenerating window registry...",
				});
				watch({
					config,
					watch_path: "src/filesystem/root",
					script_file: "src/filesystem/gen/gen_filesystem.py",
					output_file: "src/filesystem/index.ts",
					msg: "Regenerating filesystem...",
				});
			}
		},
	};
}

function watch(opts: {
	config: ResolvedConfig;
	watch_path: string;
	output_file?: string;
	script_file: string;
	msg: string;
}) {
	const { config, watch_path, script_file, msg } = opts;
	const script_name = script_file.split("/").pop();

	const regen = () => {
		config.logger.info(`[${script_name}]: ${msg}`);
		exec(`python ${script_file}`, (error, stdout, stderr) => {
			if (error) config.logger.error(`${script_name}: ERROR\r\n${error.message}`);
			if (stderr) config.logger.error(`${script_name}: STDERR\r\n${stderr}`);
		});
	};

	let input = fs.statSync(watch_path);
	if (opts.output_file) {
		let input_mtime = input.mtime;
		if (input.isDirectory()) {
			let files = glob.sync(`${watch_path}/**/*`);
			for (let file of files) {
				let stats = fs.statSync(file);
				if (stats.mtime > input_mtime) input_mtime = stats.mtime;
			}
		}
		let output_mtime = fs.statSync(opts.output_file).mtime;
		if (input_mtime > output_mtime) regen();
	}

	if (input.isDirectory()) {
		chokidar
			.watch(watch_path, { ignoreInitial: true, persistent: true })
			.on("all", (event, path) => {
				if (event === "change") regen();
			});
	} else {
		chokidar
			.watch(watch_path, { ignoreInitial: true, persistent: true })
			.on("all", (event, path) => {
				if (event === "change") regen();
			});
	}
}
