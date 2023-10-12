/**
 * @typedef {import("knex")} Knex
 */

/**
 * @param {Knex} knex
 */
exports.up = async (knex) => {
    return knex.schema.alterTable("cards", (table) => {
        table.boolean("leadCard").defaultTo(false)
    })
}

/**
 * @param {Knex} knex
 */
exports.down = async (knex) => {
    const leadCardPresent = await knex.schema.hasColumn("cards", "leadCard")

    if (leadCardPresent) {
        return knex.schema.alterTable("cards", (table) => {
            table.dropColumn("leadCard")
        })
    }
}
