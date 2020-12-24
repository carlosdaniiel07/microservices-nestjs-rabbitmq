import { Type } from "class-transformer";
import { ArrayNotEmpty, IsNotEmpty, IsPositive, IsString, ValidateNested } from "class-validator";

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  description: string

  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateEventDto)
  events: CreateEventDto[]
}

class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  operation: string

  @IsPositive()
  value: number
}