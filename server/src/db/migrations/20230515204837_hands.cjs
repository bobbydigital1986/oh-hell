/**
 * @typedef {import("knex")} Knex
 */

/**
 * @param {Knex} knex
 */
exports.up = async (knex) => {
    return knex.schema.createTable("hands", (table) => {
        table.bigIncrements("id")
        table.bigInteger("roundId")
            .unsigned()
            .index()
            .references("rounds.id")
        table.bigInteger("userId")
            .unsigned()
            .index()
            .references("users.id")
        table.timestamp("createdAt").notNullable().defaultTo(knex.fn.now())
        table.timestamp("updatedAt").notNullable().defaultTo(knex.fn.now())    
    })
}

/**
 * @param {Knex} knex
 */
exports.down = (knex) => {
    return knex.schema.dropTableIfExists("hands")
}
