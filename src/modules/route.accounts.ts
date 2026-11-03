import express from "express";
import { z } from "zod";
import { prisma } from "../prisma.ts";
import { definedData, generalBody, getSystem, integer, positiveId, resourceHandler, text } from "./resource.helpers.ts";

const Router = express.Router();
const fields = z.object({ name: text, currentValue: integer, maximumValue: integer, color: text, accontantType: text, fichaGeralId: positiveId });
const createFields = fields.extend({ currentValue: integer.default(0), maximumValue: integer.default(0), color: text.default("#b4233c"), accontantType: text.default("bar") });

Router.post(["/accounts/create", "/accounts/create/:sistema"], resourceHandler(async (req, res) => {
  if (getSystem(req, "geral") !== "geral") {
    res.status(400).json({ ErrorMessage: "Contadores disponíveis somente no sistema geral" });
    return;
  }
  const result = await prisma.accountants.create({ data: createFields.parse(generalBody(req.body)) });
  res.status(201).json({ Sucess: "Operação realizada com sucesso", data: result });
}));

Router.put(["/accounts/update/:id", "/accounts/update/:id/:sistema"], resourceHandler(async (req, res) => {
  if (getSystem(req, "geral") !== "geral") {
    res.status(400).json({ ErrorMessage: "Contadores disponíveis somente no sistema geral" });
    return;
  }
  const id = positiveId.parse(req.params.id);
  const result = await prisma.accountants.update({ where: { id }, data: definedData(fields.partial().parse(generalBody(req.body))) });
  res.status(200).json({ Sucess: "Operação realizada com sucesso", data: result });
}));

Router.get(["/accounts/list/:fichaId", "/accounts/list/:fichaId/:sistema"], resourceHandler(async (req, res) => {
  if (getSystem(req, "geral") !== "geral") {
    res.status(400).json({ ErrorMessage: "Contadores disponíveis somente no sistema geral" });
    return;
  }
  const id = positiveId.parse(req.params.fichaId);
  const result = await prisma.accountants.findMany({ where: { fichaGeralId: id } });
  res.status(200).json({ Sucess: "Operação realizada com sucesso", accounts: result });
}));

Router.delete(["/accounts/delete/:id", "/accounts/delete/:id/:sistema"], resourceHandler(async (req, res) => {
  if (getSystem(req, "geral") !== "geral") {
    res.status(400).json({ ErrorMessage: "Contadores disponíveis somente no sistema geral" });
    return;
  }
  const id = positiveId.parse(req.params.id);
  const result = await prisma.accountants.delete({ where: { id } });
  res.status(200).json({ Sucess: "Operação realizada com sucesso", data: result });
}));

export default Router;
