var amqp = require('amqp'),
	rabbit = amqp.createConnection(),
	cluster = require('cluster'),
	os = require('os');


var clients = {};

var QSubClient = {
	sub: function sub(clientQueueKey, exchangeKey, routingKey, cb) {
		var self = this;

		rabbit.queue(clientQueueKey, {
				autoDelete: false
			},
			function(workerQ) {
				self.queue = workerQ;

				console.log('%s is connected.', clientQueueKey);
				workerQ.bind(exchangeKey, routingKey, function(q) {
					console.log('%s is bound to %s, routing key : %s', clientQueueKey, exchangeKey, routingKey);
					q.subscribe({
						ack: false
					}, cb).addCallback(function(ok) {
						self.ctag = ok.consumerTag;
					});
				});
			})
	},

	unsub: function unsub() {
		if (this.ctag && this.queue) {
			this.queue.unsubscribe(this.ctag);
		}
	}
};

var QSubLogClient = Object.create(QSubClient);
QSubLogClient.onMessage =
	function(message, headers, deliveryInfo, messageObject) {
		console.log('%s get a message from %s, curr process : %s.', this.id, deliveryInfo.queue, process.pid);
		console.log("message: %s", JSON.stringify(message));
	};

var clients = {};

if (cluster.isMaster) {

	rabbit.on('ready', function() {
		console.log('connected to MQ successfully.');
		//fork workers
		var numCPUs = os.cpus().length;

		for (var i = 0; i < numCPUs; i++) {
			cluster.fork();
		}
	});

	cluster.on('online', function(worker) {
		console.log("worker %s is online.", worker.id);

		var id = worker.id;
		var c = createClient(id);
		clients[id] = c;

		c.sub("Q_" + c.id,
			'first-exchange',
			'first-queue_rt',
			c.onMessage.bind(c));
	});

	cluster.on('disconnect', function(worker) {
		console.log("worker %s is disconnect.", worker.id);

		clients[worker.id].unsub();
	});

	cluster.on('exit', function(worker) {
		console.log("worker %s is dead.", worker.id);

		clients[worker.id].unsub();
		delete clients[worker.id];
	});

	console.log('connecting to MQ...');
} else {

}

function createClient(id) {
	if (!id) return null;

	var c = Object.create(QSubLogClient);
	c.id = 'worker_' + id;

	return c;
}