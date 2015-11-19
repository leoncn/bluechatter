var amqp = require('amqp'),
	config = require('../config'),
	q = require('q'),	
	_ = require('lodash');


module.exports = function() {
	var rabbit = amqp.createConnection(config.rabbitMQ.URL);
	var deferred = q.defer();

	rabbit.on('ready', function() {
		deferred.resolve(rabbit);
		console.log('connect to rabbit.');
	});

	rabbit.on('error', _.flowRight(deferred.reject, console.error));

	return deferred.promise;
};