import express, { Request, Response } from "express";

import { DepartmentService, DocumentationService } from "../services";

export const documentsPublicRouter = express.Router();

const departments = new DepartmentService();
const db = new DocumentationService();

documentsPublicRouter.get("/", async (req: Request, res: Response) => {
  let list = await departments.getAll();
  list = list.filter((i) => i.is_active);

  let documents = await db.getAllPublic();
  documents = documents.filter((i) => i.is_active);

  for (let item of list) {
    item.documents = documents.filter((i) => i.department_id == item.id);
  }

  const allDepartDocs = documents.filter((i) => i.department_id == null);

  if (allDepartDocs.length > 0) {
    list.unshift({ name: "All Departments", documents: allDepartDocs, is_active: true });
  }

  res.json({ data: list.filter((l) => l.documents && l.documents.length > 0) });
});
