var rabbitPromise = require('./rabbit'),
	config = require('../config'),
	q = require('q');


module.exports = q.Promise(function(reslove, reject, notify) {
	rabbitPromise
		.then(function(rabbit) {
			rabbit.exchange(config.rabbitMQ.exchange, {
					type: 'topic',
					autoDelete: false
				},
				function(ex) {
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
		q.bind(config.rabbitMQ.exchange, bindingkey);
	});
}