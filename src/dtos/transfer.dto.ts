import { IsNumberString, IsOptional, IsPositive, IsString } from "class-validator"

export class TransferDto {

   @IsPositive()
   amount:number

   @IsNumberString()
   account:string

   @IsOptional()
   @IsString()
   narration:string

   @IsString()
   beneficiary:string
}