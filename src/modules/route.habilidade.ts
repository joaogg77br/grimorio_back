import express, { type Request, type Response } from "express";
import { prisma } from "../app.js";

const Router = express.Router();

// Habilidades
Router.post("/habilidades/create/", async (req: Request, res: Response) => {
  const { nome, descricao, classe, gastoPe, fichaId } = req.body;
  try {
    const habilidade = await prisma.habilidade.create({
      data: {
        nome,
        classe,
        descricao,
        gastoPe,
        fichaId,
      },
    });
    res.status(200).json({
      Sucess: "Sucesso, habilidade criada com sucesso",
      data: habilidade,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      Error: err,
      ErrorMessage: "Erro nao foi possivel criar habilidade",
    });
  }
});

Router.post("/habilidades/delete/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const habilidadeId = parseInt(`${id}`);

  try {
    const habilidade = await prisma.habilidade.delete({
      where: {
        id: habilidadeId,
      },
    });
    res.status(200).json({
      Sucess: "Sucesso, habilidade deletada com sucesso",
      data: habilidade,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      Error: err,
      ErrorMessage: "Erro nao foi possivel deletar habilidade",
    });
  }
});

Router.put("/habilidades/update/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const habilidadeId = parseInt(`${id}`);
  const { nome, descricao, gastoPe, fichaId, classe } = req.body;
  const data: {
    nome?: string;
    descricao?: string;
    gastoPe?: number;
    fichaId?: number;
    classe?: string;
  } = {};
  if (nome !== undefined) data.nome = nome;
  if (descricao !== undefined) data.descricao = descricao;
  if (gastoPe !== undefined) data.gastoPe = gastoPe;
  if (fichaId !== undefined) data.fichaId = Number(fichaId);
  if (classe !== undefined) data.classe = classe;
  try {
    const habilidade = await prisma.habilidade.update({
      where: { id: habilidadeId },
      data,
    });
    res.status(200).json({
      Sucess: "Sucesso, habilidade atualizada com sucesso",
      data: habilidade,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      Error: err,
      ErrorMessage: "Erro nao foi possivel atualizar habilidade",
    });
  }
});

Router.get(
  "/habilidades/list/:fichaId",
  async (req: Request, res: Response) => {
    const { fichaId } = req.params;
    try {
      const habilidades = await prisma.habilidade.findMany({
        where: { fichaId: Number(fichaId) },
      });
      res.status(200).json({
        Sucesso: "Sucesso habilidades listadas com sucesso",
        habilidades,
      });
    } catch (err) {
      console.log(err);
      return res
        .status(400)
        .json({ Erro: err, ErroMessage: "Erro ao listar habilidades" });
    }
  },
);

export default Router;
