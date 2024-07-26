import * as knex from "knex";

export async function up(knex: knex.Knex) {
  await knex.schema.createTable("user_departments", function (table) {
    table.increments("id").notNullable().primary();
    table.integer("department_id").notNullable().references("departments.id");
    table.integer("user_id").notNullable().references("users.id");
  });
}

export async function down(knex: knex.Knex) {
  await knex.schema.dropTable("user_departments");
}
