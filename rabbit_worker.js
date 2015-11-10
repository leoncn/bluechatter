var amqp = require('amqp'),
	rabbit = amqp.createConnection(),
	cluster = require('cluster'),
	os = require('os');


if (cluster.isMaster) {
	//fork workers
	var numCPUs = os.cpus().length;

	for (var i = 0; i < numCPUs; i++) {
		cluster.fork();
	}

	cluster.on('online', function(worker) {
		console.log("worker %s is online.", worker.id);
	});

	cluster.on('disconnect', function(worker) {
		console.log("worker %s is disconnect.", worker.id);
	});

	cluster.on('exit', function(worker) {
		console.log("worker %s is dead.", worker.id);
	});

} else {
	rabbit.on('ready', function() {
			console.log(' msg Q ready is notified.');
			var client = Object.create(rabbitSub);

			client.id = 'worker_' + worker.id;
			client.prototype.onMessage =
				function(message, headers, deliveryInfo, messageObject) {
					console.log('%s get a message from %s', this.id, deliveryInfo.queue);
					console.log("message: %s", JSON.stringify(message));
				};


			client.sub("Q_" + client.id,
				'first-exchange',
				'first-queue_rt',
				client.onMessage.bind(this));
		});

}




var rabbitSub = {
	sub: function sub(clientQueueKey, exchangeKey, routingKey, cb) {

		rabbit.queue(clientQueueKey, {
				autoDelete: false
			},
			function(workerQ) {
				console.log('%s is created.', clientQueueKey);
				workerQ.bind(exchangeKey, routingKey, function(q) {
					console.log('%s is bound.', clientQueueKey);
					q.subscribe(cb);
				});
			})
	}
}