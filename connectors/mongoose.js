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


    async bulkInsert(data){

        var endResult = [];

        for (var i = data.length - 1; i >= 0; i--) {
            var row = data[i]
            row.createdAt = new Date();

            var result = await this.model.create(row);
            endResult.push(result);
        }


        return endResult;
    }

    add(params) {
        let postData = params.post;

        if(Array.isArray(postData)){
            return this.bulkInsert(postData);
        }

        postData.createdAt = new Date();

        return this.model.create(postData);
    }

    // To handle extra HTTP request
    // verbs, you may simply add the request
    // verb name as a class method.
    delete(params) {
        let _id = params.id;
        let query = this.getQuery(params, { _id })
        return this.model.deleteMany(query).exec();
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

    putWithOperator(query, update){
         return this.model.update(query, update, { multi: true }).exec();
    }

    put(params) {
        let _id = params.id;
        let data = params.post;
        let query = this.getQuery(params, { _id })

        //Extract object keys to determine
        // if a top level key has an operator
        // flag.
        var keyAsOp = Object.keys(data)
        .filter( val => { return val.includes("$") })

        if(keyAsOp.length > 0){
            return putWithOperator(query, data);
        }

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