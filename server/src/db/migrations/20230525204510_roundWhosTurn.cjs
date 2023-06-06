/**
 * @typedef {import("knex")} Knex
 */

/**
 * @param {Knex} knex
 */
exports.up = async (knex) => {
    return knex.schema.alterTable("rounds", (table) => {
        table.bigInteger("whosTurn")
            .index()
            .unsigned()
            .references("users.id")
    })
}

/**
 * @param {Knex} knex
 */
exports.down = (knex) => {
    return knex.schema.alterTable("rounds", (table) => {
        table.dropColumn("whosTurn")
    })
}
