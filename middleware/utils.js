var config = require('../config');

exports.setRoutestoReqLocal = function(req, res, next) {
	return function(req, res, next) {
		res.locals.routes = config.routes;
		next();
	}
}
exports.csrf = function(req, res, next) {
	return function(req, res, next) {
		res.locals.token = req.csrfToken();
		next();
	}
}

exports.authenticated = function(req, res, next) {
	return function(req, res, next) {
		if (req.session.isAuthed) {
			res.locals.user = req.session.user;
			res.locals.isAuthed = req.session.isAuthed;
		} else {
			res.locals.isAuthed = false;
		}
		next();
	}
}

exports.requireAuth = function(req, res, next) {
	if (!req.session.isAuthed) {
		res.redirect(config.routes.login);
	} else {
		next();
	}
}

exports.doAuth = function(req, res) {
	if (req.body.username == 'leon') {
		req.session.user = {
			username: req.body.username
		};
		req.session.isAuthed = true;
	}
	return req.session.isAuthed;
}


exports.doLogout = function(req, res) {
	req.session.isAuthed = null;
	req.session.user = null;
}