"use strict";

var log;

var Server = function(temp_log) {
	log = temp_log;
};

Server.prototype.init = function(callback) {
	// We can add Boothstrap things here like connect to Mongo DB if we want to use a DB.
	callback();
};

Server.prototype.dataLoader = function(req, res, next) {
	req.log = log.child({
		route: req.baseUrl + req.path
	});

	next();
};

module.exports = Server;