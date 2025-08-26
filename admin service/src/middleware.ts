import {NextFunction, Request, Response} from "express";
import axios from "axios";

interface IUser{
    _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  playlist: string[];
}

interface AuthenticatedRequest extends Request{
    user?: IUser | null;
}
