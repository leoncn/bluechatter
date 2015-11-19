var exPromise = require('../queue'),
	q = require('q');

exports.express = expressLogger;
exports.dedug = debug;
exports.info = info;
exports.error = error;

function debug(jsonMsg) {
	q.when(exPromise, function(ex) {
		ex.publish('debug', jsonMsg);
	});
}

function info(jsonMsg) {
	q.when(exPromise, function(ex) {
		ex.publish('info', jsonMsg);
	});
}

function error(jsonMsg) {
	q.when(exPromise, function(ex) {
		ex.publish('error', jsonMsg);
	});
}

function expressLogger(severity) {
	var logger = debug;
	if (severity === 'info') {
		logger = info;
	}
	return function(req, res, next) {
		console.log("****************");
		console.log("URL:\t%s", req.url);
		console.log("Method:\t%s", req.method);
		console.log("cookie:\t%s", JSON.stringify(req.cookies));
		console.log("Body:\t%s", JSON.stringify(req.body));



		logger({
			url: req.url,
			ts: Date.now()
		});
		next();
	}
}