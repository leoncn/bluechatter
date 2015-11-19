

var exPromise = require('../queue'),
	q = require('q');

exports.express = expressLogger;
exports.dedug = debug;
exports.info = info;


function debug(msg) {
	q.when(exPromise, function(ex) {
		ex.publish('debug', msg);
	});
}

function info(msg) {
	q.when(exPromise, function(ex) {
		ex.publish('info', msg);
	});
}

function expressLogger(severity) {
	var logger = debug;
	if(severity === 'info') {
		logger = info;
	}
	return function(req, res, next) {
		// var msgs = [];
		// msgs.push("****************");
		// msgs.push("URL:\t%s", req.url);
		// msgs.push("Method:\t%s", req.method);
		// msgs.push("cookie:\t%s", JSON.stringify(req.cookies));
		// msgs.push("Body:\t%s", JSON.stringify(req.body));
		logger("URL: " + req.url);
		next();
	}
}