import * as knex from "knex";

export async function up(knex: knex.Knex) {
  await knex.schema.createTable("departments", function (table) {
    table.increments("id").notNullable().primary();
    table.string("name", 100).notNullable().unique();
    table.boolean("is_active").defaultTo(true).notNullable();
  });
}

export async function down(knex: knex.Knex) {
  await knex.schema.dropTable("departments");
}
