"use strict";

exports.respond = function(err, req, res, next) {
	let response = {message: req.response_display_message}, status = req.response_code;
	
	req.log.info({response: JSON.stringify(response), status: status}, "Responding the request");
	
	res.status(status).send(response);
}