module.exports = {
	port: 3000,
	secret: 'secret',
	redisHost: 'localhost',
	redisPort: 6379,
	routes: {
		login: '/login',
		logout: '/logout'
	},
	sckport: 4000,

	rabbitMQ: {
		URL: 'amqp://guest:gest@localhost:5672',
		exchange: 'chat.log',
		exchange_options: {
			type: 'topic',
			autoDelete: false,
			passive : true
		}
	}
}