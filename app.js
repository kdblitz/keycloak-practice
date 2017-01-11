var express = require('express');
var Keycloak = require('keycloak-connect');
var session = require('express-session');
var memoryStore = new session.MemoryStore();

var app = express();
var links = '<a href="/public">Public access</a> | <a href="/auth">Auth access</a> | '+
	'<a href="/extra_secure">Extra secure access</a> | <a href="/logout">Logout</a>';

app.use(session({
	secret: 'test',
	resave: false,
	saveUninitialized: true,
	store: memoryStore
}));

var keycloak = new Keycloak({store:memoryStore});
app.use(keycloak.middleware());

app.get('/', function(req, res) {
	res.send(links);
});

app.get('/public', function(req, res) {
	res.send('public domain<br/>'+links);
});

app.get('/auth', keycloak.protect(), function(req, res) {
	res.send('auth domain<br/>'+links);
});

app.get('/extra_secure', keycloak.protect('realm:proj1'), function(req, res) {
	res.send('extra secure domain<br/>'+links);
});


app.listen(3000, function() {
	console.log('app running');
});