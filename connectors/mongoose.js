var Catapult = require("./catapult")

// Sample connector implemented for 
// Mongoose ODM
// Name a class function after an http request verb to 
// expose it to the web.
class MongooseConnector extends Catapult {

    setModel(m) {
        this.model = m;
        this.apiName = m.collection.collectionName;
        return this.apiName;
    }

    add(params) {
        let postData = params.post;

        postData.createdAt = new Date();

        return this.model.create(postData);
    }

    // To handle extra HTTP request
    // verbs, you may simply add the request
    // verb name as a class method.
    delete(params) {
        let id = params.id;
        return this.model.deleteOne({ _id: id }).exec();
    }

    get(params) {
        let id = params.id;
        let queryLength = params.query ? Object.keys(params.query) : 0;
        let query = queryLength == 0 ? { _id: id } : params.query;
        return this.model.findOne(query).exec();
    }

    getQuery(params, def = {}){
        let queryLength = params.query ? Object.keys(params.query) : 0;
        let query = queryLength == 0 ? def : params.query;
        return query
    }

    put(params) {
        let id = params.id;
        let data = params.post;

        delete data.createdAt;

        delete data._id;
        data.updatedAt = new Date();

        return this.model.update({ _id: id }, {
         $set: data 
        }, { multi: true }).exec();
    }

    getAll(params) {

        let queryLength = Object.keys(params.query ? params.query : {});
        let query = queryLength == 0 ? { } : params.query;
        return this.model.find(query).exec();
    }

}

module.exports = MongooseConnector;