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

module.exports = {
	Cat,
	Dog
}