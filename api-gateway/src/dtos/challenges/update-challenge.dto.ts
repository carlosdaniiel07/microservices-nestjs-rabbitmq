import { IsDateString, IsEnum, IsNotEmpty } from "class-validator";
import { ChallengeStatus } from "../../enums/challenge-status.enum";

export class UpdateChallengeDto {
  @IsDateString()
  date: Date

  @IsEnum(ChallengeStatus)
  status: ChallengeStatus
}