import express from "express";
import { z } from "zod";
import { prisma } from "../prisma.ts";
import { definedData, generalBody, getSystem, integer, positiveId, resourceHandler, text } from "./resource.helpers.ts";

const Router = express.Router();
const fields = z.object({ nome: text, descricao: z.string() });
const tormenta = fields.extend({ classe: text, gastoPe: integer.nullable().optional(), fichaId: positiveId });
const geral = fields.extend({ custo: integer.nullable().optional(), fichaGeralId: positiveId });

Router.post(["/habilidades/create", "/habilidades/create/:sistema"], resourceHandler(async (req, res) => {
  let result;
  switch (getSystem(req)) {
    case "tormenta":
      result = await prisma.habilidade.create({ data: definedData(tormenta.parse(req.body)) });
      break;
    case "geral":
      result = await prisma.habilidadeFichaGeral.create({ data: definedData(geral.parse(generalBody(req.body))) });
      break;
  }
  res.status(200).json({ Sucess: "Operação realizada com sucesso", data: result });
}));

Router.put(["/habilidades/update/:id", "/habilidades/update/:id/:sistema"], resourceHandler(async (req, res) => {
  const id = positiveId.parse(req.params.id);
  let result;
  switch (getSystem(req)) {
    case "tormenta":
      result = await prisma.habilidade.update({ where: { id }, data: definedData(tormenta.partial().parse(req.body)) });
      break;
    case "geral":
      result = await prisma.habilidadeFichaGeral.update({ where: { id }, data: definedData(geral.partial().parse(generalBody(req.body))) });
      break;
  }
  res.status(200).json({ Sucess: "Operação realizada com sucesso", data: result });
}));

Router.get(["/habilidades/list/:fichaId", "/habilidades/list/:fichaId/:sistema"], resourceHandler(async (req, res) => {
  const id = positiveId.parse(req.params.fichaId);
  let result;
  switch (getSystem(req)) {
    case "tormenta":
      result = await prisma.habilidade.findMany({ where: { fichaId: id } });
      break;
    case "geral":
      result = await prisma.habilidadeFichaGeral.findMany({ where: { fichaGeralId: id } });
      break;
  }
  res.status(200).json({ Sucesso: "Operação realizada com sucesso", habilidades: result });
}));

Router.post(["/habilidades/delete/:id", "/habilidades/delete/:id/:sistema"], resourceHandler(async (req, res) => {
  const id = positiveId.parse(req.params.id);
  let result;
  switch (getSystem(req)) {
    case "tormenta":
      result = await prisma.habilidade.delete({ where: { id } });
      break;
    case "geral":
      result = await prisma.habilidadeFichaGeral.delete({ where: { id } });
      break;
  }
  res.status(200).json({ Sucess: "Operação realizada com sucesso", data: result });
}));

export default Router;
