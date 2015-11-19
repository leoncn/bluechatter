var rabbit = require('amqp').createConnection(),
	Q = require('q');



var params = process.argv;

if (params.length < 4) {
	throw new Error('exchange binding key not set');
}

var qname = params[2],
	exname = params[3],
	bindingkey = params[4];



connectToRabbit()
	.then(connectToEx)
	.then(bindQueue) 
	.then(subscribe)
	.done();

function connectToRabbit() {
	return Q.Promise(
		function(resloved, reject, notify) {
			rabbit.on('error', console.log);
			rabbit.on('ready', function() {
				console.log('connect to rabbit');
				resloved(rabbit);
			});
		}
	)
}

function connectToEx() {
	rabbit.exchange(exname, function(ex) {
		console.log('connect to exchange %s', exname)
	});
	return 'done';
}

function bindQueue() {
	return Q.Promise(
		function(resloved, reject, notify) {
			rabbit.queue(
				qname, {
					autoDelete: false
				},
				function(mq) {
					mq.bind(exname, bindingkey, function() {
						console.log('bind %s to %s with key %s', qname, exname, bindingkey);
						resloved(mq);
					});

				})
		}
	)
}

function subscribe(mq) {
	mq.subscribe(function(message, headers, deliveryInfo, messageObject) {
		console.log("message: %s", JSON.stringify(message));
	});
}