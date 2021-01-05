import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class UpdatePlayerDto {
  @IsString()
  @IsNotEmpty()
  name?: string
  
  @IsEmail()
  email?: string
  
  @IsString()
  @IsOptional()
  phone?: string
  
  @IsString()
  @IsOptional()
  photo?: string
}