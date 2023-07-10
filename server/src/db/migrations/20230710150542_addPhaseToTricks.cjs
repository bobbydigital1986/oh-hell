/**
 * @typedef {import("knex")} Knex
 */

/**
 * @param {Knex} knex
 */
exports.up = async (knex) => {
    return knex.schema.alterTable("tricks", (table) => {
        table.string("phase").defaultTo("")
    })
}

/**
 * @param {Knex} knex
 */
exports.down = async (knex) => {
    const tricksPhase = await knex.schema.hasColumn("tricks", "phase")

    if (tricksPhase) {
        return knex.schema.alterTable("tricks", (table) => {table.dropColumn("phase")})
    }
}
