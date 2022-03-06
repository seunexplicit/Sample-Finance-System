import { NAME } from '../constants/schema-name.constant';
import { User } from '../interfaces/users.interface';
import { Document, model } from 'mongoose';
import { userSchema } from './users.model';
import { transactionSchema } from './transaction.model';
import { TransactionHistory } from './../interfaces/transaction.interface';
import { accountSchema } from './account.model';
import { Account } from '../interfaces/account.interface';

const schemaMapping = {
   USER:{name:NAME.user, schema:userSchema},
   TRANSACTION:{name:NAME.transaction, schema:transactionSchema},
   ACCOUNT:{name:NAME.account, schema:accountSchema},
}

export const userModel = model<User & Document>(schemaMapping.USER.name, schemaMapping.USER.schema);
export const transactionModel = model<TransactionHistory & Document>(schemaMapping.TRANSACTION.name, schemaMapping.TRANSACTION.schema);
export const accountModel = model<Account & Document>(schemaMapping.ACCOUNT.name, schemaMapping.ACCOUNT.schema);
