import express from "express";
import { z } from "zod";
import { prisma } from "../prisma.ts";
import { definedData, generalBody, getSystem, integer, positiveId, resourceHandler, text } from "./resource.helpers.ts";

const Router = express.Router();
const fields = z.object({ nome: text, atributo: text, treino: integer, outros: integer });
const tormenta = fields.extend({ metadeDoNivel: integer, fichaId: positiveId });
const geral = fields.extend({ fichaGeralId: positiveId });

Router.post(["/pericias/create", "/pericias/create/:sistema"], resourceHandler(async (req, res) => {
  let result;
  switch (getSystem(req)) {
    case "tormenta":
      result = await prisma.pericia.create({ data: definedData(tormenta.parse(req.body)) });
      break;
    case "geral":
      result = await prisma.periciasFichaGeral.create({ data: definedData(geral.parse(generalBody(req.body))) });
      break;
  }
  res.status(201).json({ Sucess: "Operação realizada com sucesso", pericias: result });
}));

Router.put(["/pericias/update/:periciaId", "/pericias/update/:periciaId/:sistema"], resourceHandler(async (req, res) => {
  const id = positiveId.parse(req.params.periciaId);
  let result;
  switch (getSystem(req)) {
    case "tormenta":
      result = await prisma.pericia.update({ where: { id }, data: definedData(tormenta.partial().parse(req.body)) });
      break;
    case "geral":
      result = await prisma.periciasFichaGeral.update({ where: { id }, data: definedData(geral.partial().parse(generalBody(req.body))) });
      break;
  }
  res.status(200).json({ Sucess: "Operação realizada com sucesso", pericias: result });
}));

Router.get(["/pericias/list/:fichaId", "/pericias/list/:fichaId/:sistema"], resourceHandler(async (req, res) => {
  const id = positiveId.parse(req.params.fichaId);
  let result;
  switch (getSystem(req)) {
    case "tormenta":
      result = await prisma.pericia.findMany({ where: { fichaId: id } });
      break;
    case "geral":
      result = await prisma.periciasFichaGeral.findMany({ where: { fichaGeralId: id } });
      break;
  }
  res.status(200).json({ Sucess: "Operação realizada com sucesso", pericias: result });
}));

export default Router;
