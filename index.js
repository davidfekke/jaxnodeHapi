var Hapi = require('hapi'),
	Joi = require('joi');

var config = {
    views: {
        engines: { hbs: require('handlebars') },
        path: __dirname + '/templates'
    }
};

var server = new Hapi.Server('localhost', 3000, config);

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
	},
	{
		method: 'GET',
		path: '/index',
		handler: function (request, reply) {
			var context = {
				title: 'Views Example',
				message: 'Hello, World'
			};

			reply.view('index', context);
		}
	}
];

server.route(routes);

server.start(function () {
    console.log('Server running at:', server.info.uri);
});
 