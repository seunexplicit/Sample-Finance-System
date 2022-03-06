import { AccountType } from '@/interfaces/account.interface';
import { IsEnum, IsMongoId, IsOptional } from 'class-validator';

export class createAccountDto{
   @IsEnum(AccountType)
   accountType:AccountType
}

export class historyParamsDto{
   @IsMongoId()
   transactionId:string
}

export class historyBodyDto{
   @IsOptional()
   @IsMongoId()
   account:string
}