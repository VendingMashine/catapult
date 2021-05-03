var Service = require("./service")

class Counter extends Service {

    constructor() {
        super()
        this.count = 0
    }


    getName() {
        return "counter"
    }

    get(params = null) {

        this.count++

        return `The latest number is ${this.count}!`

    }

}

module.exports = Counter