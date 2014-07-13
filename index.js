var Hapi = require('hapi');
var server = new Hapi.Server(3000);

var routes = [
	{
	    method: 'GET',
	    path: '/',
	    handler: function (request, reply) {
	        reply({ msg: 'Hello, world!' });
	    }
	},
	{
	    method: 'GET',
	    path: '/{name}',
	    handler: function (request, reply) {
	        reply({ msg: 'Hello, ' + encodeURIComponent(request.params.name) + '!'});
	    }
	}
];

server.route(routes);

server.start(function () {
    console.log('Server running at:', server.info.uri);
});
