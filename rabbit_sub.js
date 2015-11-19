var rabbit = require('amqp').createConnection(),
	Q = require('q'),
	_ = require('lodash'),
	config = require('./config');



var params = process.argv;

if (params.length < 4) {
	console.log('Usage : queue_name, exchange_name, bindingkey');
	process.exit(1);
}

var qname = params[2],
	exname = params[3],
	bindingkey = params[4];



connectToRabbit()
	.then(connectToEx)
	.then(bindQueue)
	.done(subscribe);

function connectToRabbit() {
	var deferred = Q.defer();

	rabbit.on('error', _.flowRight(deferred.reject, console.error));

	rabbit.on('ready', function() {
		deferred.resolve(rabbit);
		console.log('connect to rabbit');
	});

	return deferred.promise;
}

function connectToEx() {
	var deferred = Q.defer();

	checkExExists()
		.then(deferred.resolve)
		.fail(function() {
			var options = config.rabbitMQ.exchange_options;
			options.passive = false;
			console.log('creating a new exchange %s.', exname);
			rabbit.exchange(exname, options, deferred.resolve);
		})
		.done();
	return deferred.promise;
}

function checkExExists() {
	var deferred = Q.defer();
	var options = config.rabbitMQ.exchange_options;
	options.passive = true;

	var exchange = rabbit.exchange(exname, options, deferred.resolve);
	exchange.on('error', deferred.reject);

	return deferred.promise;
}


function bindQueue() {
	var deferred = Q.defer();
	rabbit.queue(
		qname, {
			autoDelete: false
		},
		function(mq) {
			mq.bind(exname, bindingkey, function() {
				deferred.resolve(mq);
				console.log('bind %s to %s with key %s', qname, exname, bindingkey);
			});

		});

	return deferred.promise;
}

function subscribe(mq) {
	mq.subscribe(function(message, headers, deliveryInfo, messageObject) {
		console.log("[%s] - %s", deliveryInfo.routingKey, JSON.stringify(message));
	});
}