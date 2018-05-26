"use strict";

var kafka = require('kafka-node');
var HighLevelProducer = kafka.HighLevelProducer;
var config = require(global.__base + "config.js");
var uuid = require('node-uuid');

exports.publishMessageInit = function(req, res, next) {
	if (!req.body || !req.body.order_id || !req.body.type || !req.body.customer_info || !req.body.template_id) {
		req.log.error({passed_body: JSON.stringify(req.body)}, "Invalid request received for Publishing Messages");
		req.response_code = 400;
		req.response_display_message = "Bad Request";
	} else {
		req.message_id = uuid.v4();
	}
	next(req.response_code);
}

exports.publishMessagesToKafka = function (req, res, next) {
	let options = {}, data = {topic: req.message.queue, messages: []}, payload = [], producer, client;

	client = kafka.Client(config.zookeeper.host);

	options.requireAcks = req.message.require_ack || config.producer.options.require_acknowledgement;
	options.ackTimeoutMs = req.message.ack_timeout || config.producer.options.acknowledgement_timeout;
	options.partitionerType = req.message.partitioner_type || config.producer.options.partitioner_type;

	data.messages.push(JSON.stringify(req.message));
	payload.push(data);

	producer = new HighLevelProducer(client, options);

	producer.on("ready", function(err, response) {
		if (err) {
			req.log.error({error: JSON.stringify(err), response: JSON.stringify(response)}, "Producer is not ready to publish the record");
			req.response_code = 500;
			req.response_display_message = "Producer not ready to push the message";
			next(req.response_code);
		} else {
			client.refreshMetadata([req.message.queue], function(err3) {
				if (err3) {
					req.log.error({error: JSON.stringify(err3)}, "Failed to refresh the meta data");
					producer.close();
					client.close();
					req.response_code = 500;
					req.response_display_message = "Failed to refresh the meta data";
					next(req.response_code);
				} else {
					producer.send(payload, function(err2, result) {
						if (err2) {
							req.log.error({error: JSON.stringify(err2)}, "Producer failed to publish the record");
							req.response_code = 500;
							req.response_display_message = "Producer failed to publish the record";
						} else {
							req.log.info({result: JSON.stringify(result)}, "Successfully sent the record to the Broker");

							req.response_body = {message_id: req.message_id};
							req.response_code = 200;
							req.response_display_message = "Successfully sent the record to the Broker";
						}
						producer.close();
						client.close();
						next(req.response_code);
					});
				}
			});
		}
	});

	producer.on("error", function (err) {
		req.log.error({error: JSON.stringify(err)}, "Error while initializing Producer");
		req.response_code = 500;
		req.response_display_message = "Error while initializing Producer";
		producer.close();
		client.close();
		next(req.response_code);
	});
};