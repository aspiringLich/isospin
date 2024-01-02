const { Args } = include("/lib/args");

args = new Args(process.argv);
const help = args.arg("help", { bool: true });

if (help) {
	console.println("yeehaw");
	return;
}
