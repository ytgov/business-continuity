import express, { Request, Response } from "express";

import { DepartmentService, DocumentationService } from "../services";
import { isArray } from "lodash";
import { DocumentationSecurityLevel } from "../data/models";

export const documentsRouter = express.Router();

const departments = new DepartmentService();
const db = new DocumentationService();

documentsRouter.get("/", async (req: Request, res: Response) => {
  let list = await departments.getAll();
  list = list.filter((i) => i.is_active);

  let documents = await db.getAll();
  documents = documents.filter((i) => i.is_active);

  if (req.user && req.user.roles) {
    const roles = isArray(req.user.roles) ? req.user.roles : req.user.roles.split(",");

    if (!roles.includes("Restricted")) {
      documents = documents.filter((d) => d.security_level != DocumentationSecurityLevel.YG_RESTRICTED);
    }
  }

  for (let item of list) {
    item.documents = documents.filter((i) => i.department_id == item.id);
  }

  const allDepartDocs = documents.filter((i) => i.department_id == null);

  if (allDepartDocs.length > 0) {
    list.unshift({ name: "All Departments", documents: allDepartDocs, is_active: true });
  }

  res.json({ data: list.filter((l) => l.documents && l.documents.length > 0) });
});
