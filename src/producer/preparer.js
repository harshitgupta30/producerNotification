"use strict";

exports.publishMessages = function(req, res, next) {
	req.message = {
		message_id: req.message_id,
		order_id: req.body.order_id,
		queue: req.body.type,
		customer_info: req.body.customer_info,
		template_id: req.body.template_id
	};

	next();
}
