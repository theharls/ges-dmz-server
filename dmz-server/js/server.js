// DMZ SMS server for inbound SMS.

"use strict";

/*
* config.json looks like this:
* {
 "port": 8090,
 "inboundAuthQueryParam": "AccountSid",
 "inboundAuthId": "ACdd400e273ec4a6362069ea6c26c2a7e3",
 "pmsServerAuthId": "ACdd400e273ec4a6362069ea6c26c2a7e3"
 }

 inboundAuthQueryParam can be set to false if no incoming security is required.
 If it is set to a string, that query parameter must be present in the incoming HTTP request,
 and it must match inboundAuthId.

 pmsServerAuthId is set in the poker server's config.json authId and it must match in order
 to collect messages from this server and to update waitlist and odometer information.
*
* */

module.exports = function (config) {
	var express = require("express");
	var app = express();
	var queue = [];
	var odometers = {};
	var waitlist = {};
	var noAuth = { auth: 0 };

	app.use(function (req, res, next) {
		if (config.verbose) console.log(req.path, req.query);
		next();
	});

	app.get("/", function (req, res) {
		return res.json({ product: config.product, version: config.version });
	});
	app.get("/version", function (req, res) {
		return res.json({ product: config.product, version: config.version });
	});

	// From WWW
	app.get("/sms", function (req, res) {
		var acceptMessage = true;
		if (config.inboundAuthQueryParam && req.query[config.inboundAuthQueryParam] !== config.inboundAuthId) acceptMessage = false;
		if (acceptMessage) {
			queue.push({
				fromNumber: req.query.From || req.query.fromNumber || req.query.from || req.query.source || req.query.mobile,
				message: req.query.Body || req.query.body || req.query.message || req.query.text || req.query.response,
				status: "OK messageId:" + (req.query.SmsMessageSid || req.query.messageId || req.query.replyMessageId || req.query.message_id)
			});
		}
		res.sendStatus(200);
	});

	// From PMS
	app.get("/collect", function (req, res) {
		return res.json(req.query.authId === config.pmsServerAuthId && queue.length ? queue.shift() : noAuth);
	});
	app.get("/set", function (req, res) {
		// Set odometers and waitlist
		if (req.query.authId !== config.pmsServerAuthId) return res.json(noAuth);
		odometers = JSON.parse(req.query.odometers);
		waitlist = JSON.parse(req.query.waitlist);
		res.json({ ok: 1 });
	});

	// From WWW
	app.get(["/odometer", "/odometers"], function (req, res) {
		return res.json(req.query.authId === config.pmsServerAuthId ? odometers : noAuth);
	});
	app.get("/waitlist", function (req, res) {
		return res.json(req.query.authId === config.pmsServerAuthId ? waitlist : noAuth);
	});

	var server = void 0;
	var ssl = config.ssl;
	if (ssl) {
		var fs = require("fs");
		var options = {
			key: fs.readFileSync(config.ssl.key),
			cert: fs.readFileSync(config.ssl.cert)
		};
		server = require("https").createServer(options, app);
		console.log("Using SSL");
	} else server = require("http").createServer(app);
	server.listen(config.port);
	console.log("GES DMZ Server listening on port", config.port);
};

//# sourceMappingURL=server.js.map