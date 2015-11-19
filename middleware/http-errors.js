exports.notfound = function(req, res, next) {
	return function(req, res, next) {
		res.status(404).send( "Reqested URL " + req.url + " is not available.");
		res.end();
	}
}

exports.svrerror = function(req, res, next) {
	return function(req, res, next) {
		res.status(500).send("Encounter problems when processing " + req.url);
		res.end();
	}
}
