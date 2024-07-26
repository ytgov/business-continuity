import express, { Request, Response } from "express";
import { param } from "express-validator";

import { DepartmentService } from "../services";
import { ReturnValidationErrors } from "../middleware";
import { Department } from "../data/models";

export const departmentRouter = express.Router();
const db = new DepartmentService();

departmentRouter.get("/", async (req: Request, res: Response) => {
  let list = await db.getAll();
  res.json({ data: list });
});

departmentRouter.post("/", async (req: Request, res: Response) => {
  let { name, is_active } = req.body;

  let department = { name, is_active } as Department;

  await db.create(department).catch((e) => {
    console.log("ERROR CREATE", e);
    return res.json({ data: { error: [{ text: e, variant: "error" }] } });
  });

  res.json({});
});

departmentRouter.put(
  "/:id",
  [param("id").notEmpty().isInt()],
  ReturnValidationErrors,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    let { name, is_active } = req.body;

    let department = { name, is_active } as Department;

    await db.update(id, department).catch((e) => {
      console.log("ERROR UPDATE");
      return res.json({ data: { error: [{ text: e, variant: "error" }] } });
    });

    res.json({});
  }
);
