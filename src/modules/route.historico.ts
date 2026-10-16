import express, { type Request, type Response } from "express";
import { prisma } from "../app.js";

const Router = express.Router();

Router.post(
  "/historico/create/:fichaId",
  async (req: Request, res: Response) => {
    const { value } = req.body;
    const { fichaId } = req.params;
    try {
      const historico = await prisma.historico.create({
        data: {
          fichaId: Number(fichaId),
          value,
        },
      });
      console.log("Sucesso");
      return res
        .status(200)
        .json({ Sucess: "Historico adicionado com sucesso", historico });
    } catch (err) {
      console.log(err);
      res
        .status(400)
        .json({ Erro: err, ErroMessage: "Erro ao adicionar historico" });
    }
  },
);

Router.put("/historico/update/:id", async (req: Request, res: Response) => {
  const { value } = req.body;
  const { id } = req.params;
  try {
    const historico = await prisma.historico.update({
      where: {
        id: Number(id),
      },
      data: {
        value,
      },
    });
    console.log("Sucesso");
    return res
      .status(200)
      .json({ Sucess: "Historico atualizado com sucesso", historico });
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({ Erro: err, ErroMessage: "Erro ao atualizado historico" });
  }
});

Router.get("/historico/list/:fichaId", async (req: Request, res: Response) => {
  const { fichaId } = req.params;
  try {
    const historico = await prisma.historico.findMany({
      where: { fichaId: Number(fichaId) },
    });
    console.log("Sucesso");
    return res
      .status(200)
      .json({ Sucess: "Historico listado com sucesso", historico });
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({ Erro: err, ErroMessage: "Erro ao listar historico" });
  }
});

Router.delete(
  "/historico/delete/:historicoId",
  async (req: Request, res: Response) => {
    const { historicoId } = req.params;
    try {
      const historico = await prisma.historico.delete({
        where: {
          id: Number(historicoId),
        },
      });
      console.log("Sucesso,historico deletado", historico);
      return res
        .status(200)
        .json({ Sucess: "Historico deletado com sucesso", historico });
    } catch (err) {
      console.log(err);
      res
        .status(400)
        .json({ Erro: err, ErroMessage: "Erro ao deletar historico" });
    }
  },
);

export default Router;
