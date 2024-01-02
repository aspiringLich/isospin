class Args {
	args = {};
	params = [];
	expected_args = new Set();
	arg_defs = {};

	constructor(argv) {
		let prev_arg = false;
		argv.slice(1).forEach((arg) => {
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
	}

	/**
	 * Retrieve the value of an argument provided to the program.
	 *
	 * @param {string} arg
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
	arg(arg, options) {
		const long_arg = `--${arg}`;
		const negative_arg = `--no-${arg}`;
		const short_arg = `-${arg[0]}`;

		this.arg_defs[arg] = options;

		let { short, required, default_value, bool } = {
			short: true,
			required: false,
			default_value: undefined,
			bool: false,
			...options,
		};

		if (short && this.args[short_arg] && this.args[long_arg]) {
			throw `${process_name(
				this.argv[0]
			)}: ${short_arg} and ${long_arg} cannot be used together`;
		}
		if (bool && required) {
			throw `${process_name(
				this.argv[0]
			)}: argument \`${long_arg}\` cannot be both required and a boolean flag`;
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
			if (short)
				throw `${process_name(
					this.argv[0]
				)}: argument ${long_arg} (${short_arg}) is required`;
			else throw `${process_name(this.argv[0])}: argument ${long_arg} is required`;
		}

		return default_value;
	}

	/**
	 *
	 * @param {string} name
	 */
	param(name) {}

	finish() {
		for (const arg of Object.keys(this.args)) {
			if (arg.startsWith("-")) {
				throw `${process_name(this.argv[0])}: ${arg}: Unknown option`;
			}
		}
	}
}

function process_name(argv0) {
	return /\/([^/]+).js$/.exec(argv0)[1];
}

function args(argv, expected_args) {
	let args = {};

	for (const arg of Object.keys(args)) {
		if (!expected_args.includes(arg)) {
			throw `${process_name(argv[0])}: ${arg}: Unknown option`;
		}
	}

	return new Args(args);
}

module.exports = { Args };
