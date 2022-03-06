import { SECRET_KEY } from "../config";
import { DataStoredInToken, TokenData } from "../interfaces/auth.interface";
import { User } from "../interfaces/users.interface";
import { sign } from "jsonwebtoken";

export function createToken(user: User): TokenData {
   const dataStoredInToken: DataStoredInToken = { _id: user._id };
   const secretKey: string = SECRET_KEY;
   const expiresIn: number = 60 * 60;

   return { expiresIn, token: sign(dataStoredInToken, secretKey, { expiresIn }) };
 }