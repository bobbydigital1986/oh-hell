/**
 * @typedef {import("knex")} Knex
 */

/**
 * @param {Knex} knex
 */
exports.up = async (knex) => {
    return knex.schema.alterTable("registrations", (table) => {
        table.integer("gameScore").defaultTo(0)
    })
}

/**
 * @param {Knex} knex
 */
exports.down = (knex) => {
    return knex.schema.alterTable("registrations", (table) => {
        table.dropColumn("gameScore")
    })
}
