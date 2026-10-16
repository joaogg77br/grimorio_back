import express, { type Request, type Response } from "express";
import { prisma } from "../app.js";

const Router = express.Router();

// --- ARMAS ---
Router.get("/equipamentos/sexo", (req: Request, res: Response) => {
  res.status(300).json({ ola: "ola" })
})

Router.post(
  ["/equipamentos/create/Armas", "/equipamentos/create/Arma"],
  async (req: Request, res: Response) => {
    try {
      const {
        fichaId,
        nome,
        preco,
        dadoDeDano,
        alcance,
        peso,
        tipoDano,
        atributo,
        tipoArma,
        critico,
        pericia,
        multiplicador,
        descricao,
        equiped,
      } = req.body;
      const arma = await prisma.arma.create({
        data: {
          fichaId: Number(fichaId),
          atributo,
          pericia,
          nome,
          peso: Number(peso),
          alcance,
          preco: Number(preco),
          tipoDano,
          descricao,
          critico: Number(critico),
          tipoArma,
          multiplicador: Number(multiplicador),
          dadoDeDano,
          equiped: equiped !== undefined ? Boolean(equiped) : false,
        },
      });
      res.status(201).json({ message: "Arma criada com sucesso", data: arma });
    } catch (err) {
      res
        .status(400)
        .json({ Error: err, ErrorMessage: "Erro ao tentar adicionar arma" });
    }
  },
);

Router.get(
  [
    "/equipamentos/listAll/Armas/:fichaId",
    "/equipamentos/listAll/Arma/:fichaId",
  ],
  async (req: Request, res: Response) => {
    const { fichaId } = req.params;
    const id = parseInt(`${fichaId}`);

    try {
      const armas = await prisma.arma.findMany({
        where: {
          fichaId: id,
        },
      });
      return res
        .status(200)
        .json({ message: "Armas listadas com sucesso", data: armas });
    } catch (err) {
      return res
        .status(400)
        .json({ Error: err, ErrorMessage: "Erro ao listar armas" });
    }
  },
);

Router.get(
  ["/equipamentos/get/Armas/:armaId", "/equipamentos/get/Arma/:armaId"],
  async (req: Request, res: Response) => {
    const { armaId } = req.params;
    const id = parseInt(`${armaId}`);
    try {
      const arma = await prisma.arma.findUnique({
        where: { id },
      });
      if (!arma)
        return res.status(404).json({ ErrorMessage: "Arma nao encontrada" });
      return res
        .status(200)
        .json({ message: "Arma encontrada com sucesso", data: arma });
    } catch (err) {
      return res
        .status(400)
        .json({ Error: err, ErrorMessage: "Erro ao buscar arma" });
    }
  },
);

Router.put(
  ["/equipamentos/update/Armas/:armaId", "/equipamentos/update/Arma/:armaId"],
  async (req: Request, res: Response) => {
    const { armaId } = req.params;
    const id = parseInt(`${armaId}`);
    const {
      nome,
      preco,
      dadoDeDano,
      alcance,
      peso,
      tipoDano,
      tipoArma,
      critico,
      multiplicador,
      atributo,
      descricao,
      pericia,
      equiped,
    } = req.body;

    const data: any = {};
    if (nome !== undefined) data.nome = nome;
    if (preco !== undefined) data.preco = Number(preco);
    if (dadoDeDano !== undefined) data.dadoDeDano = dadoDeDano;
    if (alcance !== undefined) data.alcance = alcance;
    if (peso !== undefined) data.peso = Number(peso);
    if (tipoDano !== undefined) data.tipoDano = tipoDano;
    if (tipoArma !== undefined) data.tipoArma = tipoArma;
    if (critico !== undefined) data.critico = Number(critico);
    if (multiplicador !== undefined) data.multiplicador = Number(multiplicador);
    if (atributo !== undefined) data.atributo = atributo;
    if (descricao !== undefined) data.descricao = descricao;
    if (pericia !== undefined) data.pericia = pericia;
    if (equiped !== undefined) data.equiped = Boolean(equiped);

    try {
      const arma = await prisma.arma.update({
        where: { id },
        data,
      });
      res
        .status(200)
        .json({ message: "Arma atualizada com sucesso", data: arma });
    } catch (err) {
      console.log(err);
      res
        .status(400)
        .json({ Error: err, ErrorMessage: "Erro ao tentar atualizar arma" });
    }
  },
);

Router.delete(
  ["/equipamentos/delete/Armas/:armaId", "/equipamentos/delete/Arma/:armaId"],
  async (req: Request, res: Response) => {
    const { armaId } = req.params;
    const id = parseInt(`${armaId}`);
    try {
      const ArmaDeletada = await prisma.arma.delete({
        where: {
          id,
        },
      });
      res
        .status(200)
        .json({ message: "Arma deletada com sucesso", ArmaDeletada });
    } catch (err) {
      res
        .status(400)
        .json({ Error: err, ErrorMessage: "Erro ao tentar deletar arma" });
    }
  },
);

export default Router;
