var log = require('./log');


exports.notfound = function(req, res, next) {
	return function(req, res, next) {
		log.error({
			error: {
				'404': req.url
			},
			ts: Date.now()
		});
		res.status(404).send("Reqested URL " + req.url + " is not available.");
		res.end();

	}
}

exports.svrerror = function(req, res, next) {
	return function(req, res, next) {
		res.status(500).send("Encounter problems when processing " + req.url);
		res.end();
	}
}