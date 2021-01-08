import { Type } from "class-transformer";
import { ArrayNotEmpty, IsDateString, IsNotEmpty, IsNotEmptyObject, ValidateNested } from "class-validator";

export class AssignChallengeMatchDto {
  @IsDateString()
  date: Date

  @IsNotEmptyObject()
  winner: any

  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => MatchResultDto)
  results: MatchResultDto[]
}

class MatchResultDto {
  @IsNotEmpty()
  set: string
}