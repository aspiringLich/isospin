class Args {
	args = {};
	params = [];
	expected_args = new Set();
	/**
	 * Stored information about each argument
	 * @type {{ [arg: string]: { desc: string, short?: boolean, required?: boolean, default_value?: boolean, boolean?: boolean } }}
	 */
	arg_defs = {};
	mode = "args";
	param_names = [];
	/**
	 * @type {{ auto_help: boolean }}
	 */
	opts;
	summary;

	/**
	 *
	 * @param {string} summary A brief summary of the program
	 * @param {{ auto_help: boolean }} opts
	 * * `auto_help` (`true`) - Whether to automatically print the help message if the `--help` or `-h` flag are provided
	 */
	constructor(summary, opts = {}) {
		this.opts = { auto_help: true, ...opts };
		const { auto_help } = this.opts;
		this.summary = summary;

		let prev_arg = false;
		process.argv.slice(1).forEach((arg) => {
			if (arg.startsWith("-")) {
				this.args[arg] = true;
				prev_arg = arg;
			} else if (prev_arg) {
				this.args[prev_arg] = arg;
				this.params.push([prev_arg, arg]);
				prev_arg = null;
			} else {
				this.params.push([null, arg]);
			}
		});

		if (auto_help) {
			this.arg("help", "Display help about using this command", {
				bool: true,
			});
		}
	}

	/**
	 * Retrieve the value of an argument provided to the program.
	 *
	 * @param {string} arg
	 * @param {string} desc A description of the argument
	 * @param {{ short?: boolean, required?: boolean, default_value?: boolean, boolean?: boolean }} options
	 * * `short` (`true`) - Whether to allow the short form of the argument (e.g. `-h` for `--help`)
	 * * `required` (`false`) - Whether the argument is mandatory. If `true`, this function will throw an error if it is not provided
	 * * `default_value` (`undefined`) - The default value to return if the argument is not provided
	 * * `bool` (`false`) - Whether the argument is a boolean flag (e.g. `--help` or `--no-help`)
	 *   * `true`: `--help` / `-h`,
	 *   * `false`: `--no-help`
	 *   * `bool` and `required` are mutually exclusive
	 * @returns The value of the argument, or `default_value` if the argument is not provided
	 */
	arg(arg, desc, options = {}) {
		if (this.mode === "params") throw "Cannot add arguments after params";

		const long_arg = `--${arg}`;
		const negative_arg = `--no-${arg}`;
		const short_arg = `-${arg[0]}`;

		options = {
			short: true,
			required: false,
			default_value: undefined,
			bool: false,
			...options,
		};
		this.arg_defs[arg] = { desc, ...options };
		let { short, required, default_value, bool } = options;

		if (short && this.args[short_arg] && this.args[long_arg]) {
			throw `${process_name()}: ${short_arg} and ${long_arg} cannot be used together`;
		}
		if (bool && required) {
			throw `${process_name()}: argument \`${long_arg}\` cannot be both required and a boolean flag`;
		}
		if (bool && default_value === undefined) {
			default_value = false;
		}

		this.expected_args.add(long_arg);
		if (short) this.expected_args.add(short_arg);

		if (bool) {
			this.expected_args.add(negative_arg);
			if (this.args[negative_arg]) return false;
			let val;
			if (short && this.args[short_arg]) {
				val = this.args[short_arg];
			} else {
				val = this.args[long_arg];
			}

			if (val === undefined) return default_value;
			if (val === false) return false;
			return true;
		}

		if (short && this.args[short_arg]) return this.args[short_arg];
		if (this.args[long_arg]) return this.args[long_arg];

		if (required) {
			if (short) throw `${process_name()}: argument ${long_arg} (${short_arg}) is required`;
			else throw `${process_name()}: argument ${long_arg} is required`;
		}

		return default_value;
	}

	// /**
	//  *
	//  * @param {string} name The name of the parameter
	//  */
	// param(name) {
	// 	if (this.args === "args") {
	// 		this.mode = "params";

	// 		new_params = [];
	// 		for (const [flag, value] of this.params) {
	// 			if (flag && this.arg_defs[flag].boolean) {
	// 				continue;
	// 			}
	// 			new_params.push(value);
	// 		}
	// 		this.params = new_params;
	// 	}

	// 	this.param_names.push(name);
	// 	return this.params.shift();
	// }

	description(desc) {
		this.long_desc = desc.trim();
	}

	/**
	 *
	 * @param {{ ignore_params: boolean, print_help_on_error: boolean }} opts \
	 * * `ignore_params` (`true`) - Whether to throw an error if there are any remaining unused parameters
	 * * `print_help_on_error` (`true`) - Whether to print the help message if there is an error.
	 */
	finish(opts = {}) {
		const { ignore_params, print_help_on_error } = {
			ignore_params: true,
			print_help_on_error: true,
			...opts,
		};

		try {
			let unexpected_args = Object.keys(this.args)
				.filter((arg) => !this.expected_args.has(arg))
				.map((arg) => `'${arg}'`);

			if (unexpected_args.length === 1) {
				throw `${process_name()}: Unexpected argument ${unexpected_args[0]}`;
			} else if (unexpected_args.length > 1) {
				throw `${process_name()}: Unexpected arguments ${unexpected_args.join(", ")}`;
			}

			if (this.args["--help"] || this.args["-h"]) {
				this.print_help();
				process.exit(0);
			}
		} catch (e) {
			if (print_help_on_error) {
				this.print_help();
			}
			throw e;
		}
	}

	print_help() {
		let buffer = "";
		let sections = [
			["NAME", `${process_name()} - ${this.summary}`],
			["USAGE", `\x1b[0;1m${process_name()}\x1b[0;37m [\x1b[4mOPTIONS\x1b[0m]`],
		];

		const cols = console.cols();
		const wrap = (s, indent, width) => {
			let out = "";
			let line = " ".repeat(indent);

			for (const word of s.split(" ")) {
				if (line.length + word.length + 1 > width) {
					out += line + "\r\n";
					line = " ".repeat(indent);
				}
				line += word + " ";
			}
			out += line;
			return out;
		};

		if (this.long_desc) {
			sections.push(["DESCRIPTION", this.long_desc]);
		}
		sections.push(["OPTIONS", ""]);

		let first = true;
		for (const [name, section] of sections) {
			if (!first) buffer += "\r\n\r\n";
			first = false;
			buffer += `\x1b[0;4m${name}\x1b[0;37m\r\n`;
			buffer += wrap(section, 6, cols);
		}

		let argdefs = Object.entries(this.arg_defs).sort((a, b) => a[0] - b[0]);
		if (argdefs.length > 0) {
			first = true;
			for (const [arg, { desc, short, required, default_value, bool }] of argdefs) {
				if (!first) buffer += "      ";
				buffer += "\x1b[1m";
				first = false;
				if (short) buffer += `-${arg[0]}, `;

				buffer += `--${arg}\x1b[22;37m`;
				if (short && required) buffer += `, --no-${arg}`;

				if (required) buffer += " REQUIRED";
				if (default_value !== undefined) buffer += ` (default: ${default_value})`;

				console.log(desc);
				buffer += `\r\n${wrap(desc, 6, cols)}\r\n`;
			}
		}

		console.print(buffer);
	}
}

const process_name = () => /\/([^/]+).js$/.exec(process.argv0)[1];

module.exports = { Args };
