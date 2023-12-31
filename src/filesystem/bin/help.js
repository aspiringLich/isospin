function process_name(argv0) {
	return argv0.split("/").reverse()[0].split(".")[0];
}

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
		} else prev_arg = null;
	});

	for (const arg of Object.keys(args)) {
		if (!expected_args.includes(arg)) {
			throw `${process_name(argv[0])}: ${arg}: Unknown option`;
		}
	}

	return args;
}

args = args(process.argv, ["--help", "-h"]);

const help = args["--help"] || args["-h"];

if (help) {
	console.println("yeehaw");
}
