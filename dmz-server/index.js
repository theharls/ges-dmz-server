// GES Inbound SMS Server
//
"use strict";

var server = require("./js/server");
var service = require("./js/service");
var serviceName = "GES DMZ Server";
var config = require("./config.json");
var version = "V1.2";

/* CHANGE LOG
*
* - V1.0 - Initial.
* - V1.1 - Allows SSL.
* - V1.2 - Waitlist and odometers set from PMS Server and can be read by clients.
*
* */

console.log("\nGES DMZ Server " + version);
// Need to set directory for service.
process.chdir(__dirname);

var verbose = process.argv[2] && process.argv[2].toLowerCase() === "-v";
if (verbose) process.argv[2] = null;

if (process.argv[2]) {
	var installing = process.argv[2].toLowerCase() === "--install" || process.argv[2].toLowerCase() === "-i";
	var uninstalling = process.argv[2].toLowerCase() === "--uninstall" || process.argv[2].toLowerCase() === "-u";

	if (installing || uninstalling) {
		service(__filename, serviceName, installing);
	}
	else {
		showUse();
		process.exit(0);
	}
}
else {
	// no params - run directly
	showUse();
	config.product = serviceName;
	config.version = version;
	config.verbose = verbose;
	server(config);
}

function showUse() {
	console.log("\nnode app -i   to install service\nnode app -u   to uninstall service\nnode app -v   verbose mode");
}

