import { User } from "../data/models";
import { db } from "../data";
import { isArray } from "lodash";

export class UserService {
  async getAll(): Promise<User[]> {
    return db.from("users").orderBy(["first_name", "last_name"]);
  }

  async getBySub(auth_subject: string): Promise<User | undefined> {
    let user = await db<User>("users").where({ auth_subject }).first();

    if (user && user.roles) {
      if (!isArray(user.roles)) user.roles = user.roles.split(",");
    }

    return user;
  }

  async getById(id: number | string): Promise<User | undefined> {
    let user = await db<User>("users")
      .where({ id: parseInt(`${id}`) })
      .first();

    if (user && user.roles) {
      if (!isArray(user.roles)) user.roles = user.roles.split(",");
    }
    return user;
  }

  async getByEmail(email: string): Promise<User | undefined> {
    if (email) {
      let user = await db<User>("users").where({ email }).first();

      if (user && user.roles) {
        if (!isArray(user.roles)) user.roles = user.roles.split(",");
      }

      return user;
    }

    return undefined;
  }

  async create(item: any): Promise<any> {
    return db("users").insert(item);
  }

  async update(id: number | string, item: any): Promise<User> {
    return db("users")
      .where({ id: parseInt(`${id}`) })
      .update(item);
  }
}
