import express, { Request, Response } from "express";
import { param } from "express-validator";

import { DocumentationService } from "../services";
import { ReturnValidationErrors } from "../middleware";
import { Documentation } from "../data/models";

export const documentationRouter = express.Router();
const db = new DocumentationService();

documentationRouter.get("/", async (req: Request, res: Response) => {
  let list = await db.getAll();
  res.json({ data: list });
});

documentationRouter.post("/", async (req: Request, res: Response) => {
  let { name, is_active, department_id, description, text_value } = req.body;

  let documentation = { name, is_active, department_id, description, text_value } as Documentation;

  await db.create(documentation).catch((e) => {
    console.log("ERROR CREATE", e);
    return res.json({ data: { error: [{ text: e, variant: "error" }] } });
  });

  res.json({});
});

documentationRouter.put(
  "/:id",
  [param("id").notEmpty().isInt()],
  ReturnValidationErrors,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    let { name, is_active, department_id, description, text_value, security_level } = req.body;

    let documentation = { name, is_active, department_id, description, text_value, security_level } as Documentation;

    await db.update(id, documentation).catch((e) => {
      console.log("ERROR UPDATE");
      return res.json({ data: { error: [{ text: e, variant: "error" }] } });
    });

    res.json({});
  }
);
