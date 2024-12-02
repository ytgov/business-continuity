import * as knex from "knex";
import { DocumentationSecurityLevel } from "../models";

export async function up(knex: knex.Knex) {
  await knex.schema.alterTable("documentations", function (table) {
    table.string("security_level", 50).nullable();
  });

  await knex("documentations").update({ security_level: DocumentationSecurityLevel.PUBLIC });
}

export async function down(knex: knex.Knex) {
  await knex.schema.alterTable("documentations", function (table) {
    table.dropColumn("security_level");
  });
}
