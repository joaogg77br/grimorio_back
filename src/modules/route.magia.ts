import express, { type Request, type Response } from "express";
import { prisma } from "../app.js";

const Router = express.Router();
type Magias = {
  execucao: string;
  alcance: string;
  alvo: string;
  duracao: string;
  truque: string;
  gastoPe: number;
  tipoMagia: string;
  descricao: string;
  circulo: string;
};

Router.post("/magias/create/", async (req: Request, res: Response) => {
  const {
    nome,
    execucao,
    alcance,
    alvo,
    duracao,
    truque,
    tipoMagia,
    gastoPe,
    descricao,
    Circulo,
    fichaId,
  } = req.body;
  try {
    const magia = await prisma.magia.create({
      data: {
        execucao,
        alcance,
        alvo,
        nome,
        duracao,
        truque,
        gastoPe,
        descricao,
        tipoMagia,
        Circulo,
        fichaId: Number(fichaId),
      },
    });
    res
      .status(200)
      .json({ Sucess: "Sucesso, magia criada com sucesso", data: magia });
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({ Error: err, ErrorMessage: "Erro nao foi possivel criar magia" });
  }
});

Router.put(
  "/magia/update/:magiaId/:fichaId",
  async (req: Request, res: Response) => {
    const { magiaId, fichaId } = req.params;
    const data: Magias = req.body;

    try {
      const magias = await prisma.magia.update({
        where: {
          id: Number(magiaId),
          fichaId: Number(fichaId),
        },
        data,
      });
      res.status(200).json({ Sucesso: "Sucesso", magias });
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        Err: err,
        ErroMessage: "Erro ao tentar editar magias tente novamente mais tarde.",
      });
    }
  },
);

Router.delete("/magias/delete/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const magiaId = parseInt(`${id}`);

  try {
    const magia = await prisma.magia.delete({
      where: {
        id: magiaId,
      },
    });
    res
      .status(200)
      .json({ Sucess: "Sucesso, magia criada com sucesso", data: magia });
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({ Error: err, ErrorMessage: "Erro nao foi possivel criar magia" });
  }
});

Router.get("/magias/list/:fichaId", async (req: Request, res: Response) => {
  const { fichaId } = req.params;
  try {
    const magias = await prisma.magia.findMany({
      where: { fichaId: Number(fichaId) },
    });
    console.log(magias);
    res
      .status(200)
      .json({ Sucesso: "Sucesso magias listadas com sucesso", magias });
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({ Erro: err, ErroMessage: "Erro ao listar magias" });
  }
});

export default Router;
