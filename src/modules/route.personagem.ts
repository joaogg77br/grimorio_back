//@ts-ignore
import express, { type Request, type Response } from "express";
import sistemaRpg from "./sistemas.json" with { type: "json" }
import { prisma } from "../prisma.ts";
import { MinHeroStatus } from "../middlewares/MinimoPersonagem.ts";

const Router = express.Router();
type Pericias = {
  nome: string;
  atributo: string;
  metadeDoNivel: number;
  treino: number;
  outros: number;
  fichaId: number;
};

Router.get(
  "/find/ficha/CampanhaAtiva/:userId/:sistema",
  async (req: Request, res: Response) => {
    const { userId, sistema } = req.params;
    try {
      switch (sistema) {
        case "tormenta":
          const campanhaTormenta20 = await prisma.fichaTormenta20.findFirst({
            where: { id: Number(userId) },
            select: {
              campanha: true,
            },
          });
          res
            .status(200)
            .json({ Sucess: "Sucesso ao listar campanhas", campanhaTormenta20 });

          break;
        case "geral":
          const campanhaGeral = await prisma.fichaGeral.findFirst({
            where: { id: Number(userId) },
            select: {
              campanhas: true
            },
          });
          res
            .status(200)
            .json({ Sucess: "Sucesso ao listar campanhas", campanhaGeral });
          break;
        default: res.status(400).json({ Error: "Sistema nao encontrado" });
      }
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
  "/create/personagem/:sistema",
  async (req: Request, res: Response) => {
    const { sistema } = req.params
    const { jogadorId, fichaFields, pericias } = req.body;
    console.log(jogadorId)
    try {
      switch (sistema) {
        case "tormenta":
          const tormentaFicha = await prisma.fichaTormenta20.create({
            data: {
              ...fichaFields,
              jogadorId: Number(jogadorId),
              pericias: {
                createMany: {
                  data: pericias.map((item: any) => ({
                    atributo: item.atributo,
                    nome: item.nome,
                    metadeDoNivel: item.metadeDoNivel,
                    treino: item.treino,
                    outros: item.outros,
                  }))
                }
              }
            },
            select: {
              armas: true,
              protecoes: true,
              id: true,
              gerais: true,
              pericias: true
            }
          })
          res.status(201).json({ message: "Ficha criada com sucesso", tormentaFicha });
          break;
        case "geral":
          console.log(pericias)
          if (pericias) {
            const fichaGeral = await prisma.fichaGeral.create({
              data: {
                ...fichaFields,
                jogadorId: Number(jogadorId),
                pericias: {
                  createMany: {
                    data: pericias.map((item: any) => ({
                      atributo: item.atributo,
                      nome: item.nome,
                      metadeDoNivel: item.metadeDoNivel,
                      treino: item.treino,
                      outros: item.outros,
                    }))
                  }
                }
              },
              select: {
                nomeJogador: true,
                nomePersonagem: true,
                defesa: true,
                pericias: true,
                armas: true,
                habilidade: true,
        accounts: true,
        camposSimples: true,
                campanhas: true,
                id: true,
              }
            })
            res.status(201).json({ message: "Ficha criada com sucesso", fichaGeral });
          } else {
            const fichaGeral = await prisma.fichaGeral.create({
              data: {
                ...fichaFields,
                jogadorId: Number(jogadorId),
              },
              select: {
                nomeJogador: true,
                nomePersonagem: true,
        defesa: true,
                pericias: true,
                armas: true,
                habilidade: true,
        accounts: true,
        camposSimples: true,
                campanhas: true,
                id: true,
              }
            })
            res.status(201).json({ message: "Ficha criada com sucesso", fichaGeral });
          }
          break;
        default: res.status(400).json({ Error: "Sistema nao encontrado" })
      }
    } catch (err) {
      console.log({ Erro: err, fichaFields, err });
      res.status(400).json({
        Error: err,
        ErrorMessage: `Erro ao tentar criar ficha tente novamente mais tarde`,
      });
    }
  },
);

// Personagens
Router.put("/atualize/ficha/personagem/:fichaId/:sistema", MinHeroStatus,
  async (req: Request, res: Response) => {
    const { fichaId, sistema } = req.params;
    const { content } = req.body;
    try {
      switch (sistema) {
        case "tormenta":
          const ficha = await prisma.fichaTormenta20.update({
            where: { id: Number(fichaId) },
            data: content,
          });
          res.status(201).json({ message: "Ficha editada com sucesso", ficha });
          break;
        case "geral": {
          const fichaGeral = await prisma.fichaGeral.update({
            where: { id: Number(fichaId) },
            data: content,
          });
          res.status(200).json({ message: "Ficha geral editada com sucesso", fichaGeral });
          break;
        }
        default:
          res.status(400).json({ message: "Erro ao achar sistema, tente novamente mais tarde." });
      }
    } catch (err) {
      console.log(err);
      res.status(400).json({
        Error: err,
        ErrorMessage: `Erro ao editar ficha tente novamente mais tarde`,
      });
    }
  },
);

Router.delete("/deleteFicha/:fichaId/:sistema", async (req: Request, res: Response) => {
  let { fichaId, sistema } = req.params;
  const fichaIDNumber: number = parseInt(`${fichaId}`);
  try {
    switch (sistema) {
      case "tormenta":
        const fichaDeletada = await prisma.fichaTormenta20.delete({
          where: {
            id: fichaIDNumber,
          },
        });
        console.log(fichaDeletada);
        res.status(200).json({
          Sucesso: "Ficha deletada com sucesso",
          SucessoMessage: fichaDeletada,

        })
        break;
      case "geral":
        const fichaGeralDeletada = await prisma.fichaGeral.delete({
          where: {
            id: fichaIDNumber,
          },
        });
        console.log(fichaGeralDeletada);
        res.status(200).json({
          Sucesso: "Ficha deletada com sucesso",
          SucessoMessage: fichaGeralDeletada,

        })
        break;
      default:
        res.status(400).json({ message: "Erro ao achar sistema, tente novamente mais tarde" })
    }
  } catch (err) {
    res
      .status(400)
      .json({ Error: err, ErrorMessage: `Erro ao deletar a ficha` });
  }
});

//na verdade todas as fichas, precisam listar de user incluindo todas as fichas do User
Router.get("/todasAsFichas/:userId", async (req: Request, res: Response) => {
  let { userId } = req.params;
  try {
    console.log(userId);
    const item = await prisma.user.findUnique({
      where: {
        id: Number(userId),
      },
      include: {
        fichaTormenta: true,
        fichaGeral: true
      },
    });

    if (!item)
      return res.status(404).json({
        Error: "Usuario nao encontrado",
        ErrorMessage: `Erro ao tentar buscar todasAsFichas`,
      });
    res.status(201).json({ message: "Fichas trazidas sucesso", data: item });
  } catch (err) {
    res.status(400).json({
      Error: err,
      ErrorMessage: `Erro ao tentar buscar todasAsFichas`,
    });
  }
});

export default Router;
