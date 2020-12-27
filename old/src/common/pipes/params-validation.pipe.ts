import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";

export class ParamsValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value || String(value).trim().length === 0) {
      throw new BadRequestException("O valor do parâmetro precisa ser informado")
    }

    return value
  }
}