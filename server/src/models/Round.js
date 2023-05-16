const Model = require("./Model.js")

class Round extends Model {
    static get tableName() {
        return "rounds"
    }
}

module.exports = Round