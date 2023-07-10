/**
 * @typedef {import("knex")} Knex
 */

/**
 * @param {Knex} knex
 */
exports.up = async (knex) => {
    return knex.schema.alterTable("games", (table) => {
        table.boolean("gameStarted").defaultTo(false)
    })
}

/**
 * @param {Knex} knex
 */
exports.down = async (knex) => {
    const gameStartedColumn = await knex.schema.hasColumn("games", "gameStarted")
    if (gameStartedColumn) {
        return knex.schema.alterTable("games", (table) => table.dropColumn("gameStarted"))
    }
}
