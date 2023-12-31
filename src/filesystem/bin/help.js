function args(argv, expected_args) {
	let args = {};

	let prev_arg = null;
	argv.slice(1).forEach((arg) => {
		if (arg.startsWith("-")) {
			args[arg] = true;
			prev_arg = arg;
		} else if (prev_arg) {
			args[prev_arg] = arg;
			prev_arg = null;
		}
	});

	for (const arg in Object.keys(args)) {
		if (!expected_args.includes(arg)) {
			throw arg + ": Unknown option";
		}
	}

	return args;
}

args(process.argv, ["--help", "-h"]);

const help = args.get("--help") || args.get("-h");

if (help) {
	console.println("yeehaw");
}
