import express, { type Request, type Response } from "express";
import { prisma } from "../app.js";
import { MinHeroStatus } from "../middlewares/MinimoPersonagem.js";

const Router = express.Router();
type Pericias = {
  nome: string;
  atributo: string;
  metadeDoNivel: number;
  treino: number;
  outros: number;
  fichaId: number;
};

type PersonagemCreateData = {
  nomePersonagem: string;
  nomeJogador: string;
  raca: string;
  divindade: string;
  origem: string;
  classe: string;
  nivel: number;
  defesa: {
    outros: number;
    atributos: string;
  };
  for_: number;
  con: number;
  des: number;
  int_: number;
  sab: number;
  car: number;
  pvMax: number;
  pvCurrent: number;
  pmMax: number;
  pmCurrent: number;
  deslocamento: number;
  tibao: any;
  jogadorId: number;
  descricao?: string;
  pericias: Pericias[];
  tamanho: string;
};

type PersonagemUpdateData = {
  nomePersonagem?: string;
  nomeJogador?: string;
  raca?: string;
  divindade?: string;
  origem?: string;
  classe?: string;
  nivel?: number;
  defesa?: {
    upsert: {
      create: { atributos: string; outros: number };
      update: { atributos: string; outros: number };
    };
  };
  for?: number;
  con?: number;
  des?: number;
  int?: number;
  sab?: number;
  car?: number;
  pvMax?: number;
  pvCurrent?: number;
  pmMax?: number;
  pmCurrent?: number;
  deslocamento?: number;
  tibao?: any;
  descricao?: string;
  tamanho?: string;
};

Router.get(
  "/find/ficha/CampanhaAtiva/:userId",
  async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
      const campanhas = await prisma.ficha.findFirst({
        where: { id: Number(userId) },
        select: {
          campanha: true,
        },
      });
      res
        .status(200)
        .json({ Sucess: "Sucesso ao listar campanhas", campanhas });
    } catch (err) {
      console.log(err);
      return res
        .status(400)
        .json({ Err: err, ErroMessage: "Erro ao tentar achar ficha" });
    }
  },
);

// Personagens
Router.post(
  "/create/personagem",
  MinHeroStatus,
  async (req: Request, res: Response) => {
    const {
      nomePersonagem,
      nomeJogador,
      raca,
      divindade,
      origem,
      classe,
      nivel,
      defesa,
      for_,
      con,
      des,
      int_,
      sab,
      car,
      pvMax,
      pvCurrent,
      pmMax,
      pmCurrent,
      deslocamento,
      tibao,
      jogadorId,
      descricao,
      pericias,
      tamanho,
    }: PersonagemCreateData = req.body;

    try {
      const ficha = await prisma.ficha.create({
        data: {
          nomeJogador,
          nomePersonagem,
          divindade,
          raca,
          origem,
          classe,
          nivel: Number(nivel),
          for: for_,
          con: Number(con),
          des: Number(des),
          int: Number(int_),
          sab: Number(sab),
          car: Number(car),
          pvMax: Number(pvMax),
          pmMax: Number(pmMax),
          pvCurrent: Number(pvCurrent),
          pmCurrent: Number(pmCurrent),
          tibao,
          tamanho,
          deslocamento: Number(deslocamento),
          descricao: descricao ?? null,
          jogadorId: Number(jogadorId),
          defesa: {
            create: {
              atributos: defesa.atributos,
              outros: defesa.outros,
            },
          },
          pericias: {
            createMany: {
              data: pericias.map((item) => ({
                atributo: item.atributo,
                nome: item.nome,
                metadeDoNivel: item.metadeDoNivel,
                treino: item.treino,
                outros: item.outros,
              })),
            },
          },
        },
        select: {
          armas: true,
          protecoes: true,
          id: true,
          gerais: true,
          pericias: true,
        },
      });
      res.status(201).json({ message: "Ficha criada com sucesso", ficha });
    } catch (err) {
      console.log(err);
      res.status(400).json({
        Error: err,
        ErrorMessage: `Erro ao tentar criar ficha tente novamente mais tarde`,
      });
    }
  },
);

// Personagens
Router.put(
  "/atualize/ficha/personagem/:fichaId",
  async (req: Request, res: Response) => {
    const { fichaId } = req.params;
    const data: PersonagemUpdateData = {};
    if (req.body.nomePersonagem !== undefined)
      data.nomePersonagem = req.body.nomePersonagem;
    if (req.body.nomeJogador !== undefined)
      data.nomeJogador = req.body.nomeJogador;
    if (req.body.raca !== undefined) data.raca = req.body.raca;
    if (req.body.divindade !== undefined) data.divindade = req.body.divindade;
    if (req.body.origem !== undefined) data.origem = req.body.origem;
    if (req.body.classe !== undefined) data.classe = req.body.classe;
    if (req.body.nivel !== undefined) data.nivel = req.body.nivel;
    if (req.body.for_ !== undefined) data.for = req.body.for_;
    if (req.body.con !== undefined) data.con = req.body.con;
    if (req.body.des !== undefined) data.des = req.body.des;
    if (req.body.int_ !== undefined) data.int = req.body.int_;
    if (req.body.sab !== undefined) data.sab = req.body.sab;
    if (req.body.car !== undefined) data.car = req.body.car;
    if (req.body.pvMax !== undefined) data.pvMax = req.body.pvMax;
    if (req.body.pvCurrent !== undefined) data.pvCurrent = req.body.pvCurrent;
    if (req.body.pmMax !== undefined) data.pmMax = req.body.pmMax;
    if (req.body.pmCurrent !== undefined) data.pmCurrent = req.body.pmCurrent;
    if (req.body.deslocamento !== undefined)
      data.deslocamento = req.body.deslocamento;
    if (req.body.tibao !== undefined) data.tibao = req.body.tibao;
    if (req.body.nomePersonagem !== undefined)
      data.nomePersonagem = req.body.nomePersonagem;
    if (req.body.descricao !== undefined) data.descricao = req.body.descricao;
    if (req.body.tamanho !== undefined) data.tamanho = req.body.tamanho;
    // ... demais campos escalares iguais ...

    if (req.body.defesa !== undefined) {
      const outros = Number(req.body.defesa.outros ?? 0);
      const atributos =
        req.body.defesa.atributos ?? req.body.defesa.atributo ?? "Des";
      data.defesa = {
        upsert: {
          create: { outros, atributos },
          update: { outros, atributos },
        },
      };
    }
    try {
      const ficha = await prisma.ficha.update({
        where: { id: Number(fichaId) },
        data,
      });
      res.status(201).json({ message: "Ficha editada com sucesso", ficha });
    } catch (err) {
      console.log(err);
      res.status(400).json({
        Error: err,
        ErrorMessage: `Erro ao editar ficha tente novamente mais tarde`,
      });
    }
  },
);

Router.delete("/deleteFicha/:fichaId", async (req: Request, res: Response) => {
  let { fichaId } = req.params;
  const fichaIDNumber: number = parseInt(`${fichaId}`);
  try {
    const fichaDeletada = await prisma.ficha.delete({
      where: {
        id: fichaIDNumber,
      },
    });
    console.log(fichaDeletada);
    res.status(200).json({
      Sucesso: "Ficha deletada com sucesso",
      SucessoMessage: fichaDeletada,
    });
  } catch (err) {
    res
      .status(400)
      .json({ Error: err, ErrorMessage: `Erro ao deletar a ficha` });
  }
});

Router.get("/todasAsFichas/:userId", async (req: Request, res: Response) => {
  let { userId } = req.params;
  const userIdNumber = parseInt(`${userId}`);
  try {
    console.log(userId);
    const fichas: Array<any> = await prisma.ficha.findMany({
      where: {
        jogadorId: userIdNumber,
      },
      include: {
        defesa: true,
      },
    });

    console.log("fichas", fichas);
    if (fichas.length <= 0)
      res.status(400).json({
        Error: "Usuario nao encontrado",
        ErrorMessage: `Erro ao tentar buscar todasAsFichas`,
      });
    res.status(201).json({ message: "Fichas trazidas sucesso", data: fichas });
  } catch (err) {
    res.status(400).json({
      Error: err,
      ErrorMessage: `Erro ao tentar buscar todasAsFichas`,
    });
  }
});

export default Router;
