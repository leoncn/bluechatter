var http = require('http'),
	amqp = require('amqp'),
	rabbit = amqp.createConnection();


rabbit.on('ready', function() {
	rabbit.exchange('first-exchange', {
		type: 'direct',
		autoDelete: false
	}, function(ex) {
		startServer(ex);
	});
});


function startServer(ex) {
	http.createServer(function(req, res) {
		console.log(req.url);
		ex.publish('first-queue_rt', {
			message: req.url
		});
		res.setHeader("Content-Type", "text/html");
		res.end('<h1>Simple HTTP Server</h1>');
	}).listen(8001, function() {
		console.log("Queue is ready and server is listening")
	});
}