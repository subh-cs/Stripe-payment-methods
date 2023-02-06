import { Request } from "express";
export interface IGetUserAuthInfoRequest extends Request {
    stripeId: string;
    id: string;
}
