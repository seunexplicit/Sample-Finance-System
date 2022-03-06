export interface Account{
   _id:string;
   user:string;
   accountNumber:string;
   amount:number;
   type:AccountType;
}

export enum AccountType  { WALLET, SAVINGS, CURRENT }