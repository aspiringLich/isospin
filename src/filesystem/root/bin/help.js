console.log(lib);
args = lib.args(process.argv, ["--help", "-h"]);
const help = args["--help"] || args["-h"];

if (help) {
	console.println("yeehaw");
	return;
}
