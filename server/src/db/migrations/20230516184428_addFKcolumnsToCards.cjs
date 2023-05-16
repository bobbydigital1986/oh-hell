/**
 * @typedef {import("knex")} Knex
 */

/**
 * @param {Knex} knex
 */
exports.up = async (knex) => {
    return knex.schema.alterTable("cards", (table) => {
        table.bigInteger("handId")
            .index()
            .unsigned()
            .references("hands.id")
        table.bigInteger("trickPlayedId")
            .index()
            .unsigned()
            .references("tricks.id")
        table.bigInteger("trickLeadSuit")
            .index()
            .unsigned()
            .references("tricks.id")
    })
}

/**
 * @param {Knex} knex
 */
exports.down = (knex) => {
    return knex.schema.alterTable("cards", (table) => {
        table.dropColumn("handId")
        table.dropColumn("trickPlayedId")
        table.dropColumn("trickLeadSuit")
    })
}
