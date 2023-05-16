/**
 * @typedef {import("knex")} Knex
 */

/**
 * @param {Knex} knex
 */
exports.up = async (knex) => {
    return knex.schema.createTable("cards", (table) => {
        table.bigIncrements("id")
        table.string("displayString")
        table.string("rank")
        table.string("suit")
        table.integer("suitId")
        table.string("suitUnicode")
        table.integer("baseValue")
        table.string("faceUpImageURL")
        table.string("faceDownImageURL")
        table.timestamp("createdAt").notNullable().defaultTo(knex.fn.now())
        table.timestamp("updatedAt").notNullable().defaultTo(knex.fn.now())
    })
}

/**
 * @param {Knex} knex
 */
exports.down = (knex) => {
    return knex.schema.dropTableIfExists("cards")
}
