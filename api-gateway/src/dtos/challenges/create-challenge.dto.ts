import { ArrayMaxSize, ArrayMinSize, IsArray, IsDateString, IsNotEmptyObject } from "class-validator";

export class CreateChallengeDto {
  @IsDateString()
  date: Date

  @IsNotEmptyObject()
  requester: any

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  players: any[]
}