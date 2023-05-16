const Model = require("./Model.js")

class Card extends Model {
    static get tableName() {
        return "cards"
    }
}

module.exports = Card