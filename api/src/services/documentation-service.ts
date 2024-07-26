import { Documentation } from "../data/models";
import { db } from "../data";

export class DocumentationService {
  async getAll(): Promise<Documentation[]> {
    return db.from("documentations").orderBy(["name"]);
  }

  async getById(id: number | string): Promise<Documentation | undefined> {
    let item = await db<Documentation>("documentations")
      .where({ id: parseInt(`${id}`) })
      .first();
    return item;
  }

  async create(item: any): Promise<any> {
    return db("documentations").insert(item);
  }

  async update(id: number | string, item: any): Promise<Documentation> {
    return db("documentations")
      .where({ id: parseInt(`${id}`) })
      .update(item);
  }
}
