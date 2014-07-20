// David Fekke, 2014 Hapi example

//Include required objects
var Hapi = require('hapi'),
	Joi = require('joi');

//Set up your configuration
var config = {
    views: {
        engines: { hbs: require('handlebars') },
        basePath: __dirname,
		path: './templates',
		layoutPath: './templates/layout'
    }
};

//Create your server object
var server = new Hapi.Server('localhost', 3000, config);

var io = require('socket.io')(server.listener);

io.on('connection', function(socket){
  console.log('a user connected');
});

//A test list for mobile services
var myList = [
	{ _id: 1, name: 'Bob' },
	{ _id: 2, name: 'Tom' },
	{ _id: 3, name: 'Kevin' },
	{ _id: 4, name: 'Kunal' },
	{ _id: 5, name: 'John' },
	{ _id: 6, name: 'David' },
	{ _id: 7, name: 'Jason' },
	{ _id: 8, name: 'Jannaee' }
].sort(function (a, b) {
	if (a.name > b.name)
		return 1;
	if (a.name < b.name)
		return -1;
	// a must be equal to b
	return 0;
});

//Use this function as an example of how to use Server methods for your handler
function listGetById(aList, id, next) {
	for (var key in aList) {
        var curItem = aList[key];
		if (curItem._id.toString() === id)
		{
			next(null, aList[key]);
		}
	}
    next(null, { _id:-1, name: 'unknown'} );
}

//Adding server method for returning object from array
server.method({ name: 'listGetById', fn: listGetById });

//Routes array. This is a good example of how you can write your routes as a configuration
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
		path: '/mobile/list',
		handler: function (request, reply) {
			reply(myList);
		}
	},
	{
		method: 'GET',
		path: '/mobile/list/{id}',
		handler: function (request, reply) {
			server.methods.listGetById(myList, request.params.id, function(err, result) {
				reply(result);
			});
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
			reply.view('index', context, { layout: 'layout' });
		}
	},
	{
		method: 'GET',
		path: '/{param*}',
		handler: {
			directory: {
				path: 'public'
			}
		}
	}
];

//Adding your routes array to the server object
server.route(routes);

//Starting your server
server.start(function () {
    console.log('Server running at:', server.info.uri);
});
 