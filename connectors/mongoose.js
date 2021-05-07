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
        let _id = params.id;
        let query = this.getQuery(params, { _id })
        return this.model.deleteOne(query).exec();
    }

    get(params) {
        let _id = params.id;
        let query = this.getQuery(params, { _id })
        return this.model.findOne(query).exec();
    }

    getQuery(params, def = {}){
        let queryLength = params.query ? Object.keys(params.query) : 0;
        let query = queryLength == 0 ? def : params.query;
        return query
    }

    put(params) {
        let _id = params.id;
        let data = params.post;
        let query = this.getQuery(params, { _id })

        delete data.createdAt;

        delete data._id;
        data.updatedAt = new Date();

        return this.model.update(query, {
         $set: data 
        }, { multi: true }).exec();
    }

    getAll(params) {
        let query = this.getQuery(params, {})
        return this.model.find(query).exec();
    }

}

module.exports = MongooseConnector;