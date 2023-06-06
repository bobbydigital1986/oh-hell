/**
 * @typedef {import("knex")} Knex
 */

/**
 * @param {Knex} knex
 */
exports.up = async (knex) => {
    return knex.schema.createTable("betScores", (table) => {
        table.bigIncrements("id")
        table.bigInteger("registrantId")
            .notNullable()
            .unsigned()
            .index()
            .references("registrations.id")
        table.bigInteger("roundId")
            .notNullable()
            .unsigned()
            .index()
            .references("rounds.id")
        table.integer("bet")
        table.integer("tricksWon").defaultTo(0)
        table.integer("score").defaultTo(0)
        table.bigInteger("userId")
            .notNullable()
            .unsigned()
            .index()
            .references("users.id")
        table.timestamp("createdAt").notNullable().defaultTo(knex.fn.now())
        table.timestamp("updatedAt").notNullable().defaultTo(knex.fn.now())
        table.unique(["registrantId", "roundId"])
    })
}

/**
 * @param {Knex} knex
 */
exports.down = (knex) => {
    return knex.schema.dropTableIfExists("betScores")
}
