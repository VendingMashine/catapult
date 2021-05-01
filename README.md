
# catapult

Catapult is a Web API abstraction tool. The aim of this package is to simplify adding data endpoints to a NodeJS application/server. The generated API endpoints follow RFC 7231. Here is a quick guide of how this works :

For the following example to work, you must have MongoDB running.

### Import package

	var catapult = require("catapult_edm")


###  Setup Components

Initialize the RouteMapper and pass the Mongoose Connector provided with the package :

	var RouteMapper = new catapult.RouteMapper(
		catapult.MongooseConnector
	)

Now add a few Mongoose models to access through REST API

	const mongoose = require('mongoose');
	mongoose.connect(
	    'mongodb://localhost:27017/test', {
	        useNewUrlParser: true,
	        useUnifiedTopology: true
	    }
	);

	var Pet = { 
		name: String 
	}

	const Cat = mongoose.model('Cat', Pet );

	const Dog = mongoose.model('Dog', Pet );

	models = {
		Cat,
		Dog
	}

### Generate API

Add the models to the route mapper. 

	RouteMapper.add(models.Cat, models.Dog)
	var router = RouteMapper.getRouter()

Assign a route for your new endpoints 

	app.use("/",router)


### Web Interface

Once the route mapper is configured and linked to your express server, you can access your data with the following request combinations. Keep in mind that `<model name>` is the API resource name your data connector returns. The table below will assume that your router is mounted at server root.

|Request Verb | Registered Express Path | Request Body| Result |
|--|--| --| --|
| POST | `/<model name>`  | JSON string of object to add. `{ "name" : "Fluffo" }` with the models defined above in mind | Newly created object. As a json string. |
| GET  | `/<model name>?query=val` | N/A | A list of objects. Query parameters are optional, but can be used to filter results based on a passed string value.
| PUT  | `/<model name>/<object id>`  | JSON string with object updates | JSON object with success message.
| GET  | `/<model name>/<object id>` | N/A | JSON object with the ID of the requested object. `null` is returned if the object is not found.
| GET  | `/<model name>/find?query=val` | N/A | Find an individual record based on query supplied.
| DELETE  | `/<model name>/<object id>` | N/A | JSON object with success message, otherwise `null`


See the full example under test/server.js within this repository.