import { Department } from "../data/models";
import { db } from "../data";

export class DepartmentService {
  async getAll(): Promise<Department[]> {
    return db.from("departments").orderBy(["name"]);
  }

  async getById(id: number | string): Promise<Department | undefined> {
    let item = await db<Department>("departments")
      .where({ id: parseInt(`${id}`) })
      .first();
    return item;
  }

  async create(item: any): Promise<any> {
    return db("departments").insert(item);
  }

  async update(id: number | string, item: any): Promise<Department> {
    return db("departments")
      .where({ id: parseInt(`${id}`) })
      .update(item);
  }
}
