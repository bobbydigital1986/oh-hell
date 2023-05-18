/**
 * @typedef {import("knex")} Knex
 */

/**
 * @param {Knex} knex
 */
exports.up = async (knex) => {
    return knex.schema.createTable("registrations", (table) => {
        table.bigIncrements("id")
        table.bigInteger("userId")
            .notNullable()
            .unsigned()
            .index()
            .references("users.id")
        table.bigInteger("gameId")
            .notNullable()
            .unsigned()
            .index()
            .references("games.id")
        table.timestamp("createdAt").notNullable().defaultTo(knex.fn.now())
        table.timestamp("updatedAt").notNullable().defaultTo(knex.fn.now())
        table.unique(["userId", "gameId"])
    })
}

/**
 * @param {Knex} knex
 */
exports.down = (knex) => {
    return knex.schema.dropTableIfExists("registrations")
}
