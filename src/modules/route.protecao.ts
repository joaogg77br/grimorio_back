import express, { type Request, type Response } from "express";
import { prisma } from "../app.js";

const Router = express.Router();

// --- PROTEÇÕES ---
Router.post(
  ["/equipamentos/create/Protecao", "/equipamentos/create/Protecoes"],
  async (req: Request, res: Response) => {
    try {
      const {
        fichaId,
        tipoProtecao,
        penalidade,
        nomeProtecao,
        preco,
        peso,
        descricao,
        bonus,
        equipada,
      } = req.body;
      const protecao = await prisma.protecao.create({
        data: {
          fichaId: Number(fichaId),
          nomeProtecao,
          peso: Number(peso),
          penalidade: Number(penalidade),
          preco: Number(preco),
          descricao,
          bonus: Number(bonus),
          tipoProtecao,
          equipada: equipada !== undefined ? Boolean(equipada) : false,
        },
      });
      res
        .status(201)
        .json({ message: "Protecao criada com sucesso", data: protecao });
    } catch (err) {
      res.status(400).json({
        Error: err,
        ErrorMessage: "Erro ao tentar adicionar protecao",
      });
    }
  },
);

Router.get(
  [
    "/equipamentos/listAll/Protecao/:fichaId",
    "/equipamentos/listAll/Protecoes/:fichaId",
  ],
  async (req: Request, res: Response) => {
    const { fichaId } = req.params;
    const id = parseInt(`${fichaId}`);

    try {
      const protecoes = await prisma.protecao.findMany({
        where: {
          fichaId: id,
        },
      });
      return res
        .status(200)
        .json({ message: "Protecoes listadas com sucesso", data: protecoes });
    } catch (err) {
      return res
        .status(400)
        .json({ Error: err, ErrorMessage: "Erro ao listar protecoes" });
    }
  },
);

Router.get(
  ["/equipamentos/get/Protecao/:id", "/equipamentos/get/Protecoes/:id"],
  async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const protecao = await prisma.protecao.findUnique({
        where: { id: Number(id) },
      });
      if (!protecao)
        return res
          .status(404)
          .json({ ErrorMessage: "Protecao nao encontrada" });
      return res
        .status(200)
        .json({ message: "Protecao encontrada com sucesso", data: protecao });
    } catch (err) {
      return res
        .status(400)
        .json({ Error: err, ErrorMessage: "Erro ao buscar protecao" });
    }
  },
);

Router.put(
  ["/equipamentos/update/Protecao/:id", "/equipamentos/update/Protecoes/:id"],
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const protecaoId = parseInt(`${id}`);
    const {
      nomeProtecao,
      preco,
      bonus,
      penalidade,
      peso,
      tipoProtecao,
      equipada,
      descricao,
    } = req.body;

    const data: any = {};
    if (nomeProtecao !== undefined) data.nomeProtecao = nomeProtecao;
    if (preco !== undefined) data.preco = Number(preco);
    if (bonus !== undefined) data.bonus = Number(bonus);
    if (penalidade !== undefined) data.penalidade = Number(penalidade);
    if (peso !== undefined) data.peso = Number(peso);
    if (tipoProtecao !== undefined) data.tipoProtecao = tipoProtecao;
    if (equipada !== undefined) data.equipada = Boolean(equipada);
    if (descricao !== undefined) data.descricao = descricao;

    try {
      const protecao = await prisma.protecao.update({
        where: { id: protecaoId },
        data,
      });
      res
        .status(200)
        .json({ message: "Protecao atualizada com sucesso", data: protecao });
    } catch (err) {
      console.log(err);
      res.status(400).json({
        Error: err,
        ErrorMessage: "Erro ao tentar atualizar protecao",
      });
    }
  },
);

Router.delete(
  ["/equipamentos/delete/Protecao/:id", "/equipamentos/delete/Protecoes/:id"],
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const protecaoId = parseInt(`${id}`);
    try {
      const ProtecaoDeletada = await prisma.protecao.delete({
        where: {
          id: protecaoId,
        },
      });
      res
        .status(200)
        .json({ message: "Protecao deletada com sucesso", ProtecaoDeletada });
    } catch (err) {
      res
        .status(400)
        .json({ Error: err, ErrorMessage: "Erro ao tentar deletar protecao" });
    }
  },
);

Router.post(
  "/protecoes/create/:fichaId",
  async (req: Request, res: Response) => {
    const {
      preco,
      nomeProtecao,
      penalidade,
      peso,
      equipada,
      descricao,
      tipoProtecao,
      bonus,
    } = req.body;
    const { fichaId } = req.params;
    try {
      const protecao = await prisma.protecao.create({
        data: {
          preco,
          nomeProtecao,
          penalidade,
          peso,
          equipada,
          descricao,
          tipoProtecao,
          bonus,
          fichaId: Number(fichaId),
        },
      });
      console.log(protecao);
      return res
        .status(200)
        .json({ Sucess: "Sucesso ao criar protecao", protecao });
    } catch (err) {
      return res.status(400).json({
        Erro: err,
        ErroMessage: "Erro ao criar protecao,tente novamente mais tarde",
      });
    }
  },
);

Router.post(
  "/protecoes/atualize/equiped/:id",
  async (req: Request, res: Response) => {
    const { equiped } = req.body;
    const { id } = req.params;

    try {
      const protecao = await prisma.protecao.update({
        where: { id: Number(id) },
        data: { equipada: equiped },
      });
      console.log(protecao);
      return res
        .status(200)
        .json({ Sucess: "Sucesso ao criar protecao", protecao });
    } catch (err) {
      return res.status(400).json({
        Erro: err,
        ErroMessage: "Erro ao criar protecao,tente novamente mais tarde",
      });
    }
  },
);

export default Router;
