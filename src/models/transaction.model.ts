import { NAME } from "../constants/schema-name.constant";
import { TransactionType } from "../interfaces/transaction.interface";
import { Schema } from "mongoose";

export const transactionSchema: Schema = new Schema({
   user:{type:Schema.Types.ObjectId, ref:NAME.user},
   account:{type:Schema.Types.ObjectId, ref:NAME.account},
   type:{type:Number, enum:TransactionType },
   beneficiary:{type:Schema.Types.ObjectId, ref:NAME.user},
   amount:Number,
   narration:String,
   amountBTransaction:Number,
   amountATransaction:Number,
   sender:{type:Schema.Types.ObjectId, ref:NAME.user}
},
{
   timestamps: true
});