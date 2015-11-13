var http = require('http'),
	q = require('q'),
	_ = require('lodash'),
	// amqp = require('amqp'),
	// rabbit = amqp.createConnection();
	rabbit = require('./queue/rabbit');


// rabbit.on('ready', function() {
// 	rabbit.exchange('first-exchange', {
// 		type: 'direct',
// 		autoDelete: false
// 	}, function(ex) {
// 		startServer(ex);
// 	});
// });

rabbit
	.then(function(rabbit) {
		return q.Promise(function(reslove, reject, notify) {
			rabbit.exchange('first-exchange', {
				type: 'direct',
				autoDelete: false
			}, function(ex) {
				reslove(ex);
			});
		});
	})
	.then(function(ex) {
		startServer(ex);
	}).done();


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