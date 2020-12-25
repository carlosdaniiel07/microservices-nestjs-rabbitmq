import { Type } from "class-transformer";
import { IsOptional, IsString, IsNotEmpty, IsIn, IsNumber, Min, ArrayNotEmpty, ValidateNested } from "class-validator";

export class UpdateCategoryDto {
  @IsString()
  @IsOptional()
  description: string

  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => UpdateEventDto)
  events: UpdateEventDto[]
}

class UpdateEventDto {
  @IsString()
  @IsNotEmpty()
  _id: string

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