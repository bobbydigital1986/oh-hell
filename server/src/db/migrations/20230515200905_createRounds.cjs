/**
 * @typedef {import("knex")} Knex
 */

/**
 * @param {Knex} knex
 */
exports.up = async (knex) => {
    return knex.schema.createTable("rounds", (table) => {
        table.bigIncrements("id")
        table.bigInteger("gameId")
            .notNullable()
            .unsigned()
            .index()
            .references("games.id")
        table.bigInteger("dealerId")
            .notNullable()
            .unsigned()
            .index()
            .references("users.id")
        table.integer("numberOfTricks")
        table.timestamp("createdAt").notNullable().defaultTo(knex.fn.now())
        table.timestamp("updatedAt").notNullable().defaultTo(knex.fn.now())
    })
}

/**
 * @param {Knex} knex
 */
exports.down = (knex) => {
    return knex.schema.dropTableIfExists("rounds")
}
