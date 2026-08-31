import { type Request, type Response, type NextFunction } from "express"
import * as z from "zod"

const ObrigatorioDoPersonagem = z.object({
  nomePersonagem: z.string().min(1, "Campo obrigatorio").max(35, "Nome muito grande,limite maximo 35 chars"),
  nomeJogador: z.string().min(1, "Campo obrigatorio").max(35, "Nome muito grande,limite maximo 35 chars"),

  raca: z.string().min(1, "Campo obrigatorio"),
  divindade: z.string().min(1, "Campo obrigatorio").optional(),
  origem: z.string().min(1, "Campo obrigatorio"),
  classe: z.string().min(1, "Campo obrigatorio"),
  nivel: z.number(),
  for: z.number(),
  con: z.number(),
  des: z.number(),
  int: z.number(),
  sab: z.number(),
  car: z.number(),

  pvMax: z.number(),
  pvCurrent: z.number(),
  pmMax: z.number(),
  pmCurrent: z.number(),
  deslocamento: z.number(),
  jogadorId: z.number()

})
export type ObrigatorioDoPersonagemTipo = z.infer<typeof ObrigatorioDoPersonagem>

function MinHeroStatus(req: Request, res: Response, next: NextFunction) {
  const {
    nomePersonagem, nomeJogador, raca, divindade, origem, classe,
    nivel, for_, con, des, int_, sab, car,
    pvMax, pvCurrent, pmMax, pmCurrent, deslocamento, jogadorId
  } = req.body;

  ObrigatorioDoPersonagem.parse({
    nomePersonagem, nomeJogador, raca, divindade, origem, classe,
    nivel, for: for_, con, des, int: int_, sab, car,
    pvMax, pvCurrent, pmMax, pmCurrent, deslocamento, jogadorId
  });

  next();
}

export { MinHeroStatus }
