var fs = require('fs');
var path = require('path'),
	//redis = require('redis'),
	utils = require('../middleware/utils'),
	config= require('../config');

module.exports = {
		index: function(req, res) {
			res.cookie('indexCookie', 'set by index ejs.')

			return res.render('index', {
				title: 'index',
				cookie: JSON.stringify(req.cookies),
				signedcookie: JSON.stringify(req.signedCookies),
				session: JSON.stringify(req.session),
				layout: 'layout'
			});
		},

		login: function(req, res) {
			return res.render('login', {
				title: 'Login'
			})
		},

		loginProcess: function(req, res) {
			if (utils.doAuth(req, res)) {
				res.redirect('/chat');
			} else {
				res.redirect(config.routes.login);
			}
		},

		chat: function(req, res) {
			return res.render('chat', {
				title: 'Chat'
			})
		},

		logout: function(req, res) {
			utils.doLogout(req, res);
			res.redirect('index');
		}
	}
	// module.exports.ctxroot = ctxroot;

// module.exports.msg = msg;

// module.exports.poll = poll;

// function ctxroot(req, res) {
// 	fs.readFile(ctxpath('index.html'), function(err, data) {
// 		if (err)
// 			res.end(JSON.stringify(err));
// 		else
// 			res.end(data)
// 	});
// }

// var users = [],
// 	CHAN = 'chatter';

// function msg(req, res) {
// 	publisher.publish(CHAN, JSON.stringify(req.body));
// 	res.end();
// }

// function poll(req, res) {
// 	users.push(res);
// }

// function ctxpath(fp) {
// 	return path.join(__dirname, '/..', fp);
// }


// var credentials = {
// 	"host": "127.0.0.1",
// 	"port": 6379
// };

// var subscriber = redis.createClient(credentials.port, credentials.host);

// subscriber.on("error", function(err) {
// 	console.error('There was an error with the redis client ' + err);
// });

// subscriber.on('message', function(channel, msg) {
// 	if (channel == 'chatter') {
// 		var user = {};
// 		while (user = users.pop()) {
// 			user.end(msg);
// 		}
// 	}
// });

// subscriber.subscribe('chatter');

// var publisher = redis.createClient(credentials.port, credentials.host);

// publisher.on("error", function(err) {
// 	console.error('There was an error with the redis client ' + err);
// });

//if( !credentials.password && credentials.password != '' ) {
// subscriber.auth(''), publisher.auth('');
//}