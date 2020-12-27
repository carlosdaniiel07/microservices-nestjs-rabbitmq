import { Type } from "class-transformer";
import { ArrayNotEmpty, IsIn, IsNotEmpty, IsNumber, IsString, Min, ValidateNested } from "class-validator";

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
  @IsIn(['+', '-'])
  operation: string

  @IsNumber()
  @Min(0)
  value: number
}