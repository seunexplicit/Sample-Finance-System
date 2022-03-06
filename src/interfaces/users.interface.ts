import { Account } from './account.interface';
import { TransactionHistory } from './transaction.interface';

export interface User {

  _id: string;
  email: string;
  password: string;
  bvn:string,
  firstName:string,
  lastName?:string,
  accounts?:Account[]|string[]
  transactions?:TransactionHistory[]|string[]
}
