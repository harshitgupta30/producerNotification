"use strict";

global.__base = __dirname + "/";

var bunyan = require("bunyan");
var express = require("express");
var bodyParser = require("body-parser");
var http = require("http");

var routes = require(global.__base + "routes/index.js");
var Server = require(global.__base + "server.js");

var port = '4000';
var log = bunyan.createLogger({name: 'producerNotification', vertical: 'notifiction', level: 'info', src: true});

global.__logger = log;

var server = new Server(log);

server.init(function(err) {
	if(err) {
		throw err;
	} else {
		var app = express();

		app.use(server.dataLoader);

		app.use(function(req, res, next) {
			req.log = log;
			next();
		});

		app.use(bodyParser.json());
		app.use(bodyParser.urlencoded({extended: true}));
		app.use("/", routes);

		var http_server = http.createServer(app);

		http_server.listen(port);
		http_server.on("listening", function() {
			var addr = http_server.address();
			var bind = typeof addr === "string"? "pipe " + addr : "port " + addr.port;
			log.info("Express server listening on port " + bind);
		});
		
	}
});
