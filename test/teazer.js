var rs = require("randomstring")

// Test MongoDB model
// Works like the models
// intended to be used with the mongoose
// connector.
// Teazer seems cooler than "Mocker"
// Author : Cheikh Secl
class Teazer {

    constructor() {
        this.tableData = []
        this.collection = { collectionName: "Teazer" }
    }

    async create(data) {

        data._id = rs.generate(24)

        this.tableData.push(data)

        return data
    }

    queryForIndex(q) {

        var qKeys = Object.keys(q)
		var results = []

         this.tableData.forEach((el, index) => {

            var matchedAll = true;

            for (var i = qKeys.length - 1; i >= 0; i--) {
                var key = qKeys[i]

                if (q[key] != el[key]) {
                    matchedAll = false
                    break
                }
            }

            if(matchedAll){
            	results.push(index)
            }
            
        })

        return results

    }

    query(q) {

        var qKeys = Object.keys(q)

        var results = this.tableData.filter((el) => {

            var matchedAll = true;

            for (var i = qKeys.length - 1; i >= 0; i--) {
                var key = qKeys[i]

                if (q[key] != el[key]) {
                    matchedAll = false
                    break
                }
            }


            return matchedAll
        })

        return results
    }

    wrapExec(result) {
        return {
            exec: () => {
                new Promise((resolve) => {
                    resolve(result)
                })
            }
        }
    }

    findOne(query) {
        var result = this.query(query)[0]
        return this.wrapExec(result)
    }

}