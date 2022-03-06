import { IsEmail, IsOptional, IsString, IsNumberString, Length, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  public email: string;

  @MinLength(6)
  @IsString()
  public password: string;

  
  @IsString()
  firstName:string;

  @IsOptional()
  @IsString()
  lastName:string;

  @Length(10)
  @IsNumberString()
  bvn:string;
}


