const Model = require("./Model.js")

class Hand extends Model {
    static get tableName() {
        return "hands"
    }
}

module.exports = Hand