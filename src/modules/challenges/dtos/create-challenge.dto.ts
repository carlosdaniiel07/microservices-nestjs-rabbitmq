import { ArrayMaxSize, ArrayMinSize, IsArray, IsDateString, IsNotEmptyObject } from "class-validator";
import { Player } from "src/modules/players/interfaces/player.interface";

export class CreateChallengeDto {
  @IsDateString()
  date: Date

  @IsNotEmptyObject()
  requester: Player

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  players: Player[]
}