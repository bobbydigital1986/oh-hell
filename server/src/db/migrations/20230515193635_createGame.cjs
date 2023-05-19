/**
 * @typedef {import("knex")} Knex
 */

/**
 * @param {Knex} knex
 */
exports.up = async (knex) => {
    return knex.schema.createTable("games", (table) => {
        table.bigIncrements("id")
        table.integer("numberOfPlayers")
            .defaultTo(3)
        table.integer("numberOfRounds")
            .defaultTo(3)
        table.bigInteger("ownerId")
            .unsigned()
            .index()
            .references("users.id")
        table.boolean("acceptingRegistrants")
            .defaultTo(true)
        table.specificType("dealerOrder", "integer ARRAY")
        table.timestamp("createdAt").notNullable().defaultTo(knex.fn.now())
        table.timestamp("updatedAt").notNullable().defaultTo(knex.fn.now())
    })
}

/**
 * @param {Knex} knex
 */
exports.down = (knex) => {
    return knex.schema.dropTableIfExists("games")
}
