import knex from "knex";
import { Department } from "../models";

export async function seed(knex: knex.Knex) {
  const departments = await knex<Department>("departments");

  const toInsert = [{ name: "Highways & Public Works" }] as Array<Department>;

  for (const item of toInsert) {
    if (departments.find((d) => d.name == item.name)) continue;

    await knex("departments").insert(item);
  }
}
