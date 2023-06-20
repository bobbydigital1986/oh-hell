/**
 * @typedef {import("knex")} Knex
 */

/**
 * @param {Knex} knex
 */
exports.up = async (knex) => {
    return knex.schema.alterTable("registrations", (table) => {
        table.boolean("wonGame").defaultTo(false)
    })
}

/**
 * @param {Knex} knex
 */
exports.down = (knex) => {
    return knex.schema.alterTable("registrations", (table) => table.dropColumn("wonGame"))
}
