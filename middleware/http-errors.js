exports.notfound = function(req, res, next) {
	return function(req, res, next) {
		res.send(404, "Reqested URL " + req.url + " is not available.");
		next();
	}
}

exports.svrerror = function(req, res, next) {
	return function(req, res, next) {
		res.send(500, "Encounter problems when processing " + req.url);
		next();
	}
}
