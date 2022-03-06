
export interface TransactionHistory {
   _id?:string,
   user:string,
   account:string,
   type:TransactionType,
   beneficiary?:string,
   amount:number,
   narration:string,
   amountBTransaction:number,
   amountATransaction:number,
   sender?:string
}

export enum TransactionType { WITHDRAWAL, DEPOSIT, FUND }