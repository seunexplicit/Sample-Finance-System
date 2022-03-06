import { Schema } from "mongoose";
import { NAME } from '@/constants/schema-name.constant';
import { AccountType } from "@/interfaces/account.interface";

export const accountSchema: Schema = new Schema({
   user:{type:Schema.Types.ObjectId, ref:NAME.user},
   accountNumber:String,
   amount:{type:Number, default:0},
   type:{type:Number, enum:AccountType}
},{
   timestamps: true
});

accountSchema.post("init", ()=>{})

