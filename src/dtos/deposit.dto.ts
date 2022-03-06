import { IsNumberString, IsOptional, IsPositive, IsString } from "class-validator"

export class DepositDto {

   @IsPositive()
   amount:number

   @IsNumberString()
   account:string

   @IsOptional()
   @IsString()
   narration:string
}