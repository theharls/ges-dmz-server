// service.js - this module installs the server as a service.

"use strict";

module.exports = function (appRoot, serviceName, install) {
	var Service = require(/^win/.test(process.platform) ? "node-windows" : "node-linux").Service;
	console.log((install ? "Installing " : "Uninstalling ") + serviceName + "...");
	var service = new Service({
		name: serviceName,
		description: serviceName,
		script: appRoot
	});
	service.on("install", function () {
		console.log("Installation complete\nStarting server...");
		service.start();
	});
	service.on("uninstall", function () {
		console.log("Uninstall complete.");
	});

	install ? service.install() : service.uninstall();
};

//# sourceMappingURL=service.js.map

//# sourceMappingURL=service.js.map

//# sourceMappingURL=service.js.map

//# sourceMappingURL=service.js.map

//# sourceMappingURL=service.js.map

//# sourceMappingURL=service.js.map