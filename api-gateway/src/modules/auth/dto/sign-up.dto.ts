import { IsEmail, IsMobilePhone, IsNotEmpty, IsString, MinLength } from "class-validator";

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsEmail()
  email: string

  @IsMobilePhone('pt-BR')
  phoneNumber: string

  @IsString()
  @MinLength(8)
  password: string
}