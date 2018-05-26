"use strict";

var express = require("express");
var router = express.Router();
var Producer = require(global.__base + "producer/index.js");
var Responder = require(global.__base + "/io/responder.js");
var ProducerPreparer = require(global.__base + "producer/preparer.js");

router.get("/_status", function(req, res) {res.status(200).send("OK");});

router.post("/publish/message", Producer.publishMessageInit, ProducerPreparer.publishMessages, Producer.publishMessagesToKafka, Responder.respond);

router.use(function(req, res) {
	var body = {
		message: "API URL not found on server",
		code: 400
	};

	res.send(body);
});

module.exports = router;