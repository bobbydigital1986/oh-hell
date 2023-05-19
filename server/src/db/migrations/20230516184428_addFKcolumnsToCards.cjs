/**
 * @typedef {import("knex")} Knex
 */

/**
 * @param {Knex} knex
 */
exports.up = async (knex) => {
    return knex.schema.alterTable("cards", (table) => {
        table.bigInteger("userId")
            .index()
            .unsigned()
            .references("users.id")
        table.bigInteger("trickPlayedId")
            .index()
            .unsigned()
            .references("tricks.id")
        table.bigInteger("trickLeadSuit")
            .index()
            .unsigned()
            .references("tricks.id")
        table.bigInteger("roundId")
            .index()
            .unsigned()
            .references("rounds.id")
        table.boolean("trump")
            .defaultTo(false)
            
    })
}

/**
 * @param {Knex} knex
 */
exports.down = (knex) => {
    return knex.schema.alterTable("cards", (table) => {
        table.dropColumn("trickPlayedId")
        table.dropColumn("trickLeadSuit")
        table.dropColumn("roundId")
    })
}
