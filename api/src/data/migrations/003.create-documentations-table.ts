import * as knex from "knex";

export async function up(knex: knex.Knex) {
  await knex.schema.createTable("documentations", function (table) {
    table.increments("id").notNullable().primary();
    table.integer("department_id").nullable().references("departments.id");
    table.string("name", 100).notNullable();
    table.string("description", 2000).nullable();
    table.boolean("is_active").defaultTo(true).notNullable();
    table.text("text_value").nullable();
    table.binary("file_value").nullable();
    table.string("file_name", 250).nullable();
    table.string("file_type", 250).nullable();
  });
}

export async function down(knex: knex.Knex) {
  await knex.schema.dropTable("documentations");
}
