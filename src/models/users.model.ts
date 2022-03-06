import { Schema } from "mongoose";
import { NAME } from '@/constants/schema-name.constant';

export const userSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  firstName: { type: String, required: true },
  lastName: String,
  bvn: { type: String, required: true, unique: true },
  accounts:[{type:Schema.Types.ObjectId, ref:NAME.account}],
  transactions:[{type:Schema.Types.ObjectId, ref:NAME.transaction}]
},{
  timestamps: true
});

