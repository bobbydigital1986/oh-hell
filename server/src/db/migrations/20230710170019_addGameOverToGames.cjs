/**
 * @typedef {import("knex")} Knex
 */

/**
 * @param {Knex} knex
 */
exports.up = async (knex) => {
    return knex.schema.alterTable("games", (table) => {
        table.boolean("gameOver").defaultTo(false)
    })
}

/**
 * @param {Knex} knex
 */
exports.down = async (knex) => {
    const tricksPhase = await knex.schema.hasColumn("games", "gameOver")

    if (tricksPhase) {
        return knex.schema.alterTable("games", (table) => {table.dropColumn("gameOver")})
    }
}
