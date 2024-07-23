import knex from "knex";
import { RoleType } from "../models";

export async function seed(knex: knex.Knex) {
  const roles = await knex<RoleType>("role_types");

  const toInsert = [] as Array<RoleType>;

  for (const item of toInsert) {
    if (roles.find((d) => d.name == item.name)) continue;

    await knex("role_types").insert(item);
  }
}
