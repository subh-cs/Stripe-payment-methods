import { Response, NextFunction } from "express";
export declare const auth: (req: any, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
