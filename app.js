var express = require('express'),
	app = express(),
	path = require('path'),
	routes = require('./routes'),
	partials = require('express-partials'),
	http = require('http'),
	cookieParser = require('cookie-parser'),
	session = require('express-session'),
	RedisStore = require('connect-redis')(session),
	logger = require('./middleware/log'),
	bodyParser = require('body-parser'),
	csrf = require('csurf'),
	httpErr = require('./middleware/errorHandlers'),
	utils = require('./middleware//utils'),
	config = require('./config');

process.on('uncaughtException', function(err) {
	console.log('Caught exception: ' + err);
});


app.set('port', config.port);
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(utils.setRoutestoReqLocal());

app.use(partials());
app.set('view options', {
	defualtLayout: 'layout'
});

app.use(cookieParser(config.secret));
app.use(session({
	name: 'my_app_session_id',
	secret: config.secret,
	resave: false,
	saveUninitialized: true,
	store: new RedisStore({
		url: config.redisUrl
	})
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(logger());
app.use(csrf());
app.use(utils.csrf());
app.use(utils.authenticated());

app.get('/index', routes.index);
app.get(config.routes.login, routes.login)
app.post(config.routes.login, routes.loginProcess);
app.get('/chat', [utils.requireAuth], routes.chat);
app.get(config.routes.logout, routes.logout);

app.use(httpErr.notFound);
app.use(httpErr.serverErr);

http.createServer(app).listen(config.port, function() {
	console.log('HTTP Server listening on %d.', config.port);
})


var io = require('socket.io')(config.sckport);

io.on('connection', function(socket) {
	socket.on('join', function(data) {
		io.sockets.emit('userJoined',data);
		socket.username = data.username;
	})

	socket.on('ping', function(data, callback) {
		io.sockets.emit('ping', {username: socket.username});
		callback('ack');
	});
});
