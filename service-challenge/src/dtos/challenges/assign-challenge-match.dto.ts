import { Type } from "class-transformer";
import { ArrayNotEmpty, IsDateString, IsNotEmpty, IsNotEmptyObject, ValidateNested } from "class-validator";
import { Player } from "../../interfaces/players/player.interface";

export class AssignChallengeMatchDto {
  @IsDateString()
  date: Date

  @IsNotEmptyObject()
  winner: Player

  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => MatchResultDto)
  results: MatchResultDto[]
}

class MatchResultDto {
  @IsNotEmpty()
  set: string
}