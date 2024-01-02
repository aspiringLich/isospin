import type { Terminal as xtermTerminal } from "xterm";

function assert(condition: any, message?: string): asserts condition {
	if (!condition) {
		throw new Error(message);
	}
}

const abs_path = (path: string, cwd: string) => {
	let _path;
	if (path.startsWith("/")) _path = path;
	else if (path.startsWith("~/")) _path = "/home/user";
	else _path = cwd + "/" + path;
	_path = _path.trim();

	let out: string[] = _path.split("/").slice(1);
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

class FileTree {
	[filename: string]: Item;
}

enum ItemType {
	Directory,
	File,
	Script,
}

type Item =
	| {
			type: ItemType.Directory;
			content: FileTree;
	  }
	| {
			type: ItemType.File;
			content: string;
	  }
	| {
			type: ItemType.Script;
			fn: Function;
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
}

class Process {
	fs: Fs;
	argv: string[];
	argv0: string;

	constructor(fs: Fs, args: string[], path: string) {
		this.fs = fs;
		this.argv = [path, ...args];
		this.argv0 = path;
	}
}

const make_script_fn = (path: string, content: string): CommandFn => {
	const f = new Function("console", "lib", "fs", "process", "module", content);
	return (cwd, args, term, exports?) => {
		return new Promise((resolve, reject) => {
			try {
				const console = new Console(term);
				const fs = new Fs(cwd);
				const process = new Process(fs, args, path);

				var out = f.call(null, console, filesystem.lib, fs, process, { exports: exports });
			} catch (e) {
				reject(e);
			}
			resolve(out);
		});
	};
};

type CommandFn = (
	cwd: string,
	args: string[],
	terminal: xtermTerminal | null,
	exports?: Object
) => Promise<unknown>;

class FileSys {
	bin: Map<string, CommandFn> = new Map();
	lib: { [key: string]: unknown } = {};
	etc: FileTree = new FileTree();
	home: FileTree = new FileTree();

	async _init_add_file(path: string, content: string) {
		let components = path.trim().split("/");
		assert(components[0] === "");
		const base = components[1];

		switch (base) {
			case "bin":
				assert(components.length === 3, "no subfolders in bin");
				let file = components[2];
				this.bin.set(file, make_script_fn(path, content));
				break;
			case "lib":
				assert(components.length === 3, "no subfolders in lib");
				let lib = components[2].split(".")[0];
				let f = make_script_fn(path, content);

				this.lib[lib] = await f("", [], null);
				break;
		}
	}
}

export const filesystem = new FileSys();
