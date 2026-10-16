import express, { type Request, type Response } from "express";
import { prisma } from "../app.js";
import crypto from "crypto";
import VerifyLogin from "../middlewares/verifyLogin.js";
import verifyOrigem from "../middlewares/verifyOrigem.js";
import verifyMestreDaCampanha from "../middlewares/verifyMestreDaCampanha.js";
import verifyMembroCampanha from "../middlewares/verifyMembroDaCampanha.js";

const Router = express.Router();

//Campanhas
Router.post("/campanha/create/", async (req: Request, res: Response) => {
  const { nomeCampanha, playerMasterId } = req.body;
  const chaveLink = crypto.randomUUID();
  try {
    let findPlayer = await prisma.user.findUnique({
      where: {
        id: playerMasterId,
      },
    });
    console.log(findPlayer);
    if (findPlayer) {
      const campanha = await prisma.campanha.create({
        data: {
          nomeCampanha,
          chaveLink,
          playerMestreId: Number(playerMasterId),
          players: { connect: { id: playerMasterId } },
        },
      });
      console.log(campanha);
      return res
        .status(200)
        .json({ Sucess: "Sucesso ao criar campanha", campanha });
    } else
      return res.status(400).json({
        ErroMessage: "Erro ao achar usuario mestre,tente novamente mais tarde",
      });
  } catch (err) {
    return res.status(400).json({
      Erro: err,
      ErroMessage: "Erro ao criar campanha,tente novamente mais tarde",
    });
  }
});

Router.get(
  "/campanha/listMestre/:playerMestreId",
  async (req: Request, res: Response) => {
    const { playerMestreId } = req.params;
    try {
      const campanhas = await prisma.campanha.findMany({
        where: {
          playerMestreId: Number(playerMestreId),
        },
      });
      console.log(campanhas);
      return res
        .status(200)
        .json({ Sucess: "Sucesso ao listar campanhas", campanhas });
    } catch (err) {
      console.log(err);
      return res
        .status(400)
        .json({ Erro: err, ErroMessage: "Erro ao listar as campanhas" });
    }
  },
);

Router.get("/campanha/list/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const campanhas = await prisma.user.findMany({
      where: { id: Number(id) },
      select: { campanhas: true },
    });
    console.log(campanhas);
    return res
      .status(200)
      .json({ Sucess: "Sucesso ao listar campanhas", campanhas });
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({ Erro: err, ErroMessage: "Erro ao listar as campanhas" });
  }
});

Router.delete(
  "/campanha/delete/:id",
  verifyOrigem,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const campanhaDeletada = await prisma.campanha.delete({
        where: {
          id: Number(id),
        },
      });
      return res
        .status(200)
        .json({ Sucesso: "Deletado com sucesso", campanhaDeletada });
    } catch (err) {
      console.log(err);
      return res
        .status(400)
        .json({ Erro: err, ErroMessage: "Erro ao deletar campanha" });
    }
  },
);

Router.post(
  "/campanha/find/:chaveLink",
  async (req: Request, res: Response) => {
    const { chaveLink } = req.params;
    const { userId } = req.body;
    const chave = `${chaveLink}`;
    try {
      const campanhaFinded = await prisma.campanha.findFirst({
        where: {
          chaveLink: chave,
        },
      });

      if (!campanhaFinded)
        return res
          .status(400)
          .json({ ErroMessage: "Erro fiquei com preguica" });

      const campanha = await prisma.campanha.update({
        where: { id: campanhaFinded.id },
        data: { players: { connect: { id: userId } } },
      });
      console.log(campanha);
      return res
        .status(200)
        .json({ Sucesso: "Inscrito na campanha cm sucesso", campanhaFinded });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ Erro: err, ErroMessage: "Erro " });
    }
  },
);

Router.get(
  "/campanha/list/players/:campanhaId",
  async (req: Request, res: Response) => {
    const { campanhaId } = req.params;

    try {
      const players = await prisma.campanha.findMany({
        where: { id: Number(campanhaId) },
        select: { players: true, id: true },
      });
      return res.status(200).json({ Sucess: "Listado com sucesso", players });
    } catch (err) {
      return res.status(400).json({ Erro: err });
    }
  },
);

Router.delete(
  "/campanha/mestre/remove/:playerId/:campanhaId",
  verifyMestreDaCampanha,
  async (req: Request, res: Response) => {
    const { playerId, campanhaId } = req.params;
    try {
      const players = await prisma.campanha.update({
        where: { id: Number(campanhaId) },
        data: {
          players: { disconnect: { id: Number(playerId) } },
        },
      });
      return res.status(200).json({ Sucess: "Removido com sucesso" });
    } catch (err) {
      console.log("err", err)
      return res.status(400).json({ Erro: err });
    }
  },
);

Router.delete(
  "/campanha/remove/:playerId/:campanhaId",
  VerifyLogin,
  verifyMembroCampanha,
  async (req: Request, res: Response) => {
    const { playerId, campanhaId } = req.params;
    try {
      const players = await prisma.campanha.update({
        where: { id: Number(campanhaId) },
        data: {
          players: { disconnect: { id: Number(playerId) } },
        },
      });
      return res.status(200).json({ Sucess: "Removido com sucesso", players });
    } catch (err) {
      console.log(err)
      return res.status(400).json({ Erro: err });
    }
  },
);

Router.get(
  "/campanha/mestre/list/fichas/:campanhaId",
  async (req: Request, res: Response) => {
    const { campanhaId } = req.params;
    try {
      const fichas = await prisma.campanha.findFirst({
        where: { id: Number(campanhaId) },
        select: { fichas: true },
      });

      return res.status(200).json({ Sucess: "Listadas com sucesso", fichas });
    } catch (err) {
      return res.status(400).json({ Erro: err });
    }
  },
);

Router.post(
  "/ficha/add/:campanhaId/:fichaId",
  async (req: Request, res: Response) => {
    const { campanhaId, fichaId } = req.params;
    try {
      const campanhaFicha = await prisma.campanha.update({
        where: { id: Number(campanhaId) },
        data: { fichas: { connect: { id: Number(fichaId) } } },
      });
      console.log(campanhaFicha);
      res
        .status(200)
        .json({ Sucess: "Ficha adicionada com sucess", campanhaFicha });
    } catch (err) {
      console.log(err);
      res
        .status(400)
        .json({ Err: err, ErroMessage: "Erro ao adicionar ficha" });
    }
  },
);

Router.delete(
  "/ficha/remove/:campanhaId/:fichaId",
  async (req: Request, res: Response) => {
    const { campanhaId, fichaId } = req.params;
    try {
      const campanhaFicha = await prisma.campanha.update({
        where: { id: Number(campanhaId) },
        data: { fichas: { disconnect: { id: Number(fichaId) } } },
      });
      console.log(campanhaFicha);
      res
        .status(200)
        .json({ Sucess: "Ficha removida com sucess", campanhaFicha });
    } catch (err) {
      console.log(err);
      res.status(400).json({ Err: err, ErroMessage: "Erro ao remover ficha" });
    }
  },
);

export default Router;
