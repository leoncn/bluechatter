var redis = require('redis'),
	client = redis.createClient(),
	Q = require('q'),
	flow = require('flow-maintained');


function add_message(uname, msg) {
	getUid(uname)
		.then(function(uid) {
			return insert_msg(uid, msg);
		})
		.done(function() {
			console.log('done')
			client.quit();
		});
}


function getUid(uname) {
	var def = Q.defer();
	var uid = client.get(getUserIdkey(uname));

	if (uid) {
		def.reslove(uid);
	} else {
		client.incr('next.user.id', function(err, id) {
			if (err) {
				def.reject(err);
			} else {
				flow.exec(
					function() {
						client.lpush("users", uname, this.MULTI());
						client.set(getUserIdkey(uname), id, this.MULTI());
					},
					function(args) {
						def.resolve(id);
					}
				);
			}
		});
	}
	return def.promise;
}

function insert_msg(uid, msg) {
	var def = Q.defer();

	client.incr('next.msg.id', function(err, id) {
		console.log('msg id %s' ,id);
		flow.exec(
			function() {
				client.hset('msg.id.' + id, 'playload', msg, this.MULTI());
				client.hset('msg.id.' + id, 'uid', uid, this.MULTI());
				client.lpush('messages:', id, this.MULTI());
			},
			function(args) {
				def.resolve(args);
			}

		);
	});

	return def.promise;
}


function getUserIdkey(uname) {
	return "user." + uname;
}


var name = process.argv[2],
	msg = process.argv.slice(3);

client.on("error", console.log);

add_message(name, msg);
//client.quit();