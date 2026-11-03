import type { Request, RequestHandler } from "express";
import { z } from "zod";

export const positiveId = z.coerce.number().int().positive();
export const integer = z.coerce.number().int();
export const text = z.string().trim().min(1);

export function getSystem(req: Request, fallback = "tormenta") {
  return z.enum(["tormenta", "geral"]).parse(req.params.sistema ?? fallback);
}

export function generalBody(body: Record<string, unknown>) {
  return { ...body, fichaGeralId: body.fichaGeralId ?? body.fichaId };
}

export function definedData<T extends object>(data: T): { [K in keyof T]: Exclude<T[K], undefined> } {
  return Object.fromEntries(Object.entries(data).filter(([, value]) => value !== undefined)) as { [K in keyof T]: Exclude<T[K], undefined> };
}

export function resourceHandler(handler: RequestHandler): RequestHandler {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ ErrorMessage: "Dados inválidos", issues: error.issues });
        return;
      }
      const code = (error as { code?: string })?.code;
      if (code === "P2025" || code === "P2003") {
        res.status(404).json({ ErrorMessage: "Registro ou ficha não encontrado" });
        return;
      }
      console.error(error);
      res.status(400).json({ ErrorMessage: "Não foi possível concluir a operação" });
    }
  };
}
