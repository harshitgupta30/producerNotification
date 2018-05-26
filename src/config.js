"use strict";

var config = {
	zookeeper: {
		host: "localhost:2181"
	},
	producer: {
		options: {
			require_acknowledgement: 1,
			acknowledgement_timeout: 100,
			partitioner_type: 1
		}
	}
}

module.exports = config;