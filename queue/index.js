var rabbitPromise = require('./rabbit'),
	config = require('../config'),
	q = require('q');


module.exports = q.Promise(function(reslove, reject, notify) {
	rabbitPromise()
		.then(function(rabbit) {
			rabbit.exchange(config.rabbitMQ.exchange, config.rabbitMQ.exchange_options,
				function(ex) {
					console.log('connect to exchange %s', config.rabbitMQ.exchange)
					setupQueue(rabbit);
					reslove(ex);
				});
		})
		.done();
});

function setupQueue(rabbit) {
	initQueue(rabbit, 'debug.log', '*');
	initQueue(rabbit, 'error.log', 'error');
}

function initQueue(rabbit, qname, bindingkey) {
	rabbit.queue(qname, {
		autoDelete: false
	}, function(q) {
		console.log('binding %s to %s with key %s', qname, config.rabbitMQ.exchange, bindingkey )
		q.bind(config.rabbitMQ.exchange, bindingkey);
	});
}