const Model = require("./Model.js")

class Trick extends Model {
    static get tableName() {
        return "tricks"
    }
}

module.exports = Trick