import express, { type Request, type Response } from "express";
import { prisma } from "../app.js";

const Router = express.Router();

// --- ITENS (MODEL ITEM) ---
Router.post(
  ["/equipamentos/create/Item", "/equipamentos/create/Itens"],
  async (req: Request, res: Response) => {
    try {
      const { fichaId, nome, peso, descricao } = req.body;
      const data: any = {
        nome,
        peso: Number(peso),
        descricao,
      };
      if (fichaId !== undefined && fichaId !== null) {
        data.fichaId = Number(fichaId);
      }
      const item = await prisma.item.create({
        data,
      });
      res.status(201).json({ message: "Item criado com sucesso", data: item });
    } catch (err) {
      res
        .status(400)
        .json({ Error: err, ErrorMessage: "Erro ao tentar criar item" });
    }
  },
);

Router.get(
  [
    "/equipamentos/listAll/Item/:fichaId",
    "/equipamentos/listAll/Itens/:fichaId",
  ],
  async (req: Request, res: Response) => {
    const { fichaId } = req.params;
    try {
      const items = await prisma.item.findMany({
        where: { fichaId: Number(fichaId) },
      });
      return res
        .status(200)
        .json({ message: "Itens listados com sucesso", data: items });
    } catch (err) {
      return res
        .status(400)
        .json({ Error: err, ErrorMessage: "Erro ao listar itens" });
    }
  },
);

Router.get(
  ["/equipamentos/get/Item/:id", "/equipamentos/get/Itens/:id"],
  async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const item = await prisma.item.findUnique({
        where: { id: Number(id) },
      });
      if (!item)
        return res.status(404).json({ ErrorMessage: "Item nao encontrado" });
      return res
        .status(200)
        .json({ message: "Item encontrado com sucesso", data: item });
    } catch (err) {
      return res
        .status(400)
        .json({ Error: err, ErrorMessage: "Erro ao buscar item" });
    }
  },
);

Router.put(
  ["/equipamentos/update/Item/:id", "/equipamentos/update/Itens/:id"],
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { nome, peso, descricao, fichaId } = req.body;
    const data: any = {};
    if (nome !== undefined) data.nome = nome;
    if (peso !== undefined) data.peso = Number(peso);
    if (descricao !== undefined) data.descricao = descricao;
    if (fichaId !== undefined)
      data.fichaId = fichaId !== null ? Number(fichaId) : null;

    try {
      const item = await prisma.item.update({
        where: { id: Number(id) },
        data,
      });
      res
        .status(200)
        .json({ message: "Item atualizado com sucesso", data: item });
    } catch (err) {
      res
        .status(400)
        .json({ Error: err, ErrorMessage: "Erro ao tentar atualizar item" });
    }
  },
);

Router.delete(
  ["/equipamentos/delete/Item/:id", "/equipamentos/delete/Itens/:id"],
  async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const itemDeletado = await prisma.item.delete({
        where: { id: Number(id) },
      });
      res
        .status(200)
        .json({ message: "Item deletado com sucesso", itemDeletado });
    } catch (err) {
      res
        .status(400)
        .json({ Error: err, ErrorMessage: "Erro ao tentar deletar item" });
    }
  },
);

export default Router;
