import { type Response, type Request, type NextFunction } from "express";
declare function verificadorDeEmail(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
export { verificadorDeEmail };
//# sourceMappingURL=middlewaresUser.d.ts.map