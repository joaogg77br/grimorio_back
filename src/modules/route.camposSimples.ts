import express from "express";
import { z } from "zod";
import { prisma } from "../prisma.ts";
import { definedData, generalBody, getSystem, positiveId, resourceHandler, text } from "./resource.helpers.ts";

const Router = express.Router();
const fields = z.object({ nome: text, value: z.string(), fichaGeralId: positiveId });

Router.post(["/camposSimples/create", "/camposSimples/create/:sistema"], resourceHandler(async (req, res) => {
  if (getSystem(req, "geral") !== "geral") {
    res.status(400).json({ ErrorMessage: "Campos personalizados disponíveis somente no sistema geral" });
    return;
  }
  const data = fields.parse(generalBody(req.body));
  const campo = await prisma.camposSimples.create({ data });
  res.status(201).json({ Sucesso: "Campo criado com sucesso", data: campo });
}));

Router.get(["/camposSimples/list/:fichaId", "/camposSimples/list/:fichaId/:sistema"], resourceHandler(async (req, res) => {
  if (getSystem(req, "geral") !== "geral") {
    res.status(400).json({ ErrorMessage: "Campos personalizados disponíveis somente no sistema geral" });
    return;
  }
  const fichaGeralId = positiveId.parse(req.params.fichaId);
  const campos = await prisma.camposSimples.findMany({ where: { fichaGeralId }, orderBy: { id: "asc" } });
  res.status(200).json({ Sucesso: "Campos listados com sucesso", campos });
}));

Router.put(["/camposSimples/update/:id", "/camposSimples/update/:id/:sistema"], resourceHandler(async (req, res) => {
  if (getSystem(req, "geral") !== "geral") {
    res.status(400).json({ ErrorMessage: "Campos personalizados disponíveis somente no sistema geral" });
    return;
  }
  const id = positiveId.parse(req.params.id);
  const data = definedData(fields.partial().parse(generalBody(req.body)));
  const campo = await prisma.camposSimples.update({ where: { id }, data });
  res.status(200).json({ Sucesso: "Campo atualizado com sucesso", data: campo });
}));

Router.delete(["/camposSimples/delete/:id", "/camposSimples/delete/:id/:sistema"], resourceHandler(async (req, res) => {
  if (getSystem(req, "geral") !== "geral") {
    res.status(400).json({ ErrorMessage: "Campos personalizados disponíveis somente no sistema geral" });
    return;
  }
  const id = positiveId.parse(req.params.id);
  const campo = await prisma.camposSimples.delete({ where: { id } });
  res.status(200).json({ Sucesso: "Campo excluído com sucesso", data: campo });
}));

export default Router;
