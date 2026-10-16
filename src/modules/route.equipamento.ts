import express, { type Request, type Response } from "express";
import { prisma } from "../app.js";

const Router = express.Router();

// --- ITENS GERAIS ---
Router.post(
  "/equipamentos/create/Geral",
  async (req: Request, res: Response) => {
    try {
      const { fichaId, tipoItemGeral, preco } = req.body;
      const geral = await prisma.geral.create({
        data: {
          fichaId: Number(fichaId),
          tipoItemGeral,
          preco: Number(preco),
        },
      });
      res
        .status(201)
        .json({ message: "Item Geral criado com sucesso", data: geral });
    } catch (err) {
      res.status(400).json({
        Error: err,
        ErrorMessage: "Erro ao tentar adicionar item geral",
      });
    }
  },
);

Router.get(
  "/equipamentos/listAll/Geral/:fichaId",
  async (req: Request, res: Response) => {
    const { fichaId } = req.params;
    try {
      const gerais = await prisma.geral.findMany({
        where: { fichaId: Number(fichaId) },
      });
      return res
        .status(200)
        .json({ message: "Itens Gerais listados com sucesso", data: gerais });
    } catch (err) {
      return res
        .status(400)
        .json({ Error: err, ErrorMessage: "Erro ao listar itens gerais" });
    }
  },
);

Router.get(
  "/equipamentos/get/Geral/:id",
  async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const geral = await prisma.geral.findUnique({
        where: { id: Number(id) },
      });
      if (!geral)
        return res
          .status(404)
          .json({ ErrorMessage: "Item Geral nao encontrado" });
      return res
        .status(200)
        .json({ message: "Item Geral encontrado com sucesso", data: geral });
    } catch (err) {
      return res
        .status(400)
        .json({ Error: err, ErrorMessage: "Erro ao buscar item geral" });
    }
  },
);

Router.put(
  "/equipamentos/update/Geral/:id",
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { tipoItemGeral, preco } = req.body;
    const data: any = {};
    if (tipoItemGeral !== undefined) data.tipoItemGeral = tipoItemGeral;
    if (preco !== undefined) data.preco = Number(preco);

    try {
      const geral = await prisma.geral.update({
        where: { id: Number(id) },
        data,
      });
      res
        .status(200)
        .json({ message: "Item Geral atualizado com sucesso", data: geral });
    } catch (err) {
      res.status(400).json({
        Error: err,
        ErrorMessage: "Erro ao tentar atualizar item geral",
      });
    }
  },
);

Router.delete(
  "/equipamentos/delete/Geral/:id",
  async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const geralDeletado = await prisma.geral.delete({
        where: { id: Number(id) },
      });
      res
        .status(200)
        .json({ message: "Item Geral deletado com sucesso", geralDeletado });
    } catch (err) {
      res.status(400).json({
        Error: err,
        ErrorMessage: "Erro ao tentar deletar item geral",
      });
    }
  },
);

// --- LISTAR TODOS OS EQUIPAMENTOS DA FICHA ---
Router.get(
  "/equipamentos/listAll/:fichaId",
  async (req: Request, res: Response) => {
    const { fichaId } = req.params;
    const id = Number(fichaId);
    try {
      const [armas, protecoes, gerais, items] = await Promise.all([
        prisma.arma.findMany({ where: { fichaId: id } }),
        prisma.protecao.findMany({ where: { fichaId: id } }),
        prisma.geral.findMany({ where: { fichaId: id } }),
        prisma.item.findMany({ where: { fichaId: id } }),
      ]);
      return res.status(200).json({
        message: "Todos os equipamentos listados com sucesso",
        data: {
          armas,
          protecoes,
          gerais,
          items,
        },
      });
    } catch (err) {
      return res.status(400).json({
        Error: err,
        ErrorMessage: "Erro ao listar todos os equipamentos",
      });
    }
  },
);

export default Router;
