import { IsEmail, IsNotEmpty } from "class-validator"

export class CreatePlayerDto {
  @IsNotEmpty()
  readonly name: string
  
  @IsEmail()
  readonly email: string
  
  @IsNotEmpty()
  readonly phone: string
}