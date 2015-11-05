module.exports = function(req, res, next) {
	return function(req, res, next) {
		console.log("****************");
		console.log("URL:\t%s", req.url);
		console.log("Method:\t%s", req.method);
		console.log("cookie:\t%s", JSON.stringify(req.cookies));
		console.log("Body:\t%s", JSON.stringify(req.body));
		next();
	}
}