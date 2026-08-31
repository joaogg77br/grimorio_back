import { type Request, type Response, type NextFunction } from "express";
import * as z from "zod";
declare const ObrigatorioDoPersonagem: z.ZodObject<{
    nomePersonagem: z.ZodString;
    nomeJogador: z.ZodString;
    raca: z.ZodString;
    divindade: z.ZodOptional<z.ZodString>;
    origem: z.ZodString;
    classe: z.ZodString;
    nivel: z.ZodNumber;
    defesa: z.ZodNumber;
    for: z.ZodNumber;
    con: z.ZodNumber;
    des: z.ZodNumber;
    int: z.ZodNumber;
    sab: z.ZodNumber;
    car: z.ZodNumber;
    pvMax: z.ZodNumber;
    pvCurrent: z.ZodNumber;
    pmMax: z.ZodNumber;
    pmCurrent: z.ZodNumber;
    deslocamento: z.ZodNumber;
    jogadorId: z.ZodNumber;
}, z.core.$strip>;
export type ObrigatorioDoPersonagemTipo = z.infer<typeof ObrigatorioDoPersonagem>;
declare function MinHeroStatus(req: Request, res: Response, next: NextFunction): void;
export { MinHeroStatus };
//# sourceMappingURL=MinimoPersonagem.d.ts.map