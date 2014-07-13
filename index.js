var Hapi = require('hapi'),
	Joi = require('joi');
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
	    path: '/hello/{name}',
	    handler: function (request, reply) {
	        reply('Hello ' + request.params.name + '!');
	    },
	    config: {
	        validate: {
	            params: {
	                name: Joi.string().min(3).max(10)
	            }
	        }
	    }
	}
];

server.route(routes);

server.start(function () {
    console.log('Server running at:', server.info.uri);
});
 