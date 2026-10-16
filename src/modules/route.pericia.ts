import express, { type Request, type Response } from "express";
import { prisma } from "../app.js";

const Router = express.Router();
type Pericias = {
  nome: string;
  atributo: string;
  metadeDoNivel: number;
  treino: number;
  outros: number;
  fichaId: number;
};

Router.get("/pericias/list/:fichaId", async (req: Request, res: Response) => {
  const { fichaId } = req.params;
  try {
    const pericias = await prisma.pericia.findMany({
      where: {
        fichaId: Number(fichaId),
      },
      select: {
        fichaId: true,
        id: true,
        treino: true,
        outros: true,
        metadeDoNivel: true,
        atributo: true,
        nome: true,
      },
    });
    res
      .status(200)
      .json({ Sucess: "Pericia atualizada  com sucesso", pericias });
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({ Erro: err, ErrorMessage: "Erro ao listar pericias" });
  }
});

Router.put(
  "/pericias/update/:periciaId",
  async (req: Request, res: Response) => {
    const { periciaId } = req.params;
    const data: Pericias = req.body;
    try {
      const pericias = await prisma.pericia.update({
        where: { id: Number(periciaId) },
        data,
      });
      console.log(pericias);
      res
        .status(200)
        .json({ Sucess: "Pericia atualizada  com sucesso", pericias });
    } catch (err) {
      console.log(err);
      res
        .status(400)
        .json({ Error: err, ErrorMessage: "Erro ao criar as pericias" });
    }
  },
);

export default Router;
