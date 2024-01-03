import { cyrb53 } from "$lib/utils";
import type { Terminal as xtermTerminal } from "xterm";

class AssertionError extends Error {
	constructor(message: string = "Assertion failed") {
		super(message);
		this.name = "AssertionError";
	}
}

function assert(condition: any, message?: string): asserts condition {
	if (!condition) {
		throw new AssertionError(message);
	}
}

const abs_path = (path: string, cwd: string = "/home/user") => {
	let _path;
	if (path.startsWith("/")) _path = path.slice(1);
	else if (path.startsWith("~/")) _path = "/home/user";
	else _path = cwd.slice(1) + "/" + path;
	_path = _path.trim();

	let out: string[] = [];
	for (const component of _path.split("/")) {
		switch (component) {
			case ".":
				break;
			case "..":
				if (out.length > 0) out.pop();
				break;
			default:
				out.push(component);
		}
	}
	return out;
};

class Fs {
	fs: FileSys = filesystem;
	cwd: string;

	constructor(cwd: string) {
		this.cwd = cwd;
	}
}

class Console {
	term: xtermTerminal | null;
	buffer: string = "";

	constructor(term: xtermTerminal | null) {
		this.term = term;
	}

	print(...args: any[]) {
		let out = "";
		for (let i = 0; i < args.length; i++) {
			if (typeof args[i] === "string") out += args[i];
			else out += JSON.stringify(args[i]);
		}
		this.buffer += out;
		this.term?.write(out);
	}

	println(...args: any[]) {
		if (!args.length) {
			this.print("\r\n");
		} else {
			const last = args.length - 1;
			args[last] = args[last] + "\r\n";
			this.print(...args);
		}
	}

	log(...args: any[]) {
		console.log(...args);
	}

	cols() {
		return this.term?.cols ?? 0;
	}

	rows() {
		return this.term?.rows ?? 0;
	}
}

class Process {
	fs: Fs;
	argv: string[];
	argv0: string;
	exit: (code?: number) => void;

	constructor(
		fs: Fs,
		args: string[],
		path: string,
		resolve: (value: unknown) => void,
		reject: (reason?: any) => void
	) {
		this.fs = fs;
		this.argv = [path, ...args];
		this.argv0 = path;
		this.exit = (code: number = 0) => {
			if (code === 0) {
				resolve(null);
			} else {
				reject(code);
			}
		};
	}
}

class IncludeError extends Error {
	constructor(msg: string) {
		super(msg);
		this.name = "IncludeError";
	}
}

const make_script_fn = (path: string, content: string): ScriptFn => {
	try {
		var f = Function("console", "fs", "process", "module", "include", content);
	} catch (e) {
		console.log(e);
		throw e;
	}
	return (cwd, args, term, module = { exports: {} }, path_override?: string) => {
		return new Promise((resolve, reject) => {
			try {
				const console = new Console(term);
				const fs = new Fs(cwd);
				const process = new Process(fs, args, path_override ?? path, resolve, reject);
				const include = (p: string) => {
					let _module = { exports: {} };

					if (!p.endsWith(".js")) {
						p += ".js";
					}

					try {
						var imported_fn = ScriptCache.get(p);
					} catch (e) {
						// let _e = new IncludeError(`Failed to include '${path}'`);
						// _e.cause = e;
						throw e;
					}

					imported_fn(cwd, args, term, _module, path_override ?? path);
					return _module.exports;
				};

				var out = f.call(null, console, fs, process, module, include);
			} catch (e) {
				reject(e);
			}
			resolve(out);
		});
	};
};

type ScriptFn = (
	cwd: string,
	args: string[],
	terminal: xtermTerminal | null,
	module?: { exports: unknown },
	path_override?: string
) => Promise<unknown>;

export class ScriptCache {
	static cache: { [path: string]: { hash: number; fn: ScriptFn } } = {};

	static get(path: string) {
		const file = filesystem.get_file(path);
		const hash = cyrb53(file);

		const prev_hash = this.cache[path]?.hash;
		if (prev_hash === hash) {
			return this.cache[path].fn;
		} else {
			const fn = make_script_fn(path, file);
			this.cache[path] = { hash, fn };
			return fn;
		}
	}
}

type FileTree = { [filename: string]: FileTree | string };

class FileNotFoundError extends Error {
	constructor(path: string) {
		super(`File not found: ${path}`);
		this.name = "FileNotFoundError";
	}
}

class FileSys {
	tree: FileTree = {};

	_init_add_file(path: string, content: string) {
		let components = abs_path(path.trim());
		console.log(this.tree);
	}

	/**
	 *
	 * @param path The path of the file
	 * @returns The file object
	 * @throws FileNotFoundError
	 */
	get_file(path: string) {
		let tree = this.tree;
		const components = abs_path(path);

		for (let i = 0; i < components.length; i++) {
			const component = components[i];
			tree = tree[component] as FileTree;
			if (!tree) {
				throw new FileNotFoundError(path);
			}
		}

		return tree as unknown as string;
	}

	/**
	 * Returns an interator over the contents of a directory
	 */
	*listdir(path: string) {
		let tree = this.tree;
		const components = abs_path(path);

		for (let i = 0; i < components.length; i++) {
			const component = components[i];
			tree = tree[component] as FileTree;
			if (!tree) {
				throw new FileNotFoundError(path);
			}
		}

		for (const key of Object.keys(tree)) {
			yield key;
		}
	}
}

export const filesystem = new FileSys();
