import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { isMongoId } from 'class-validator'

export class MongoIdValidationPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    if (!value || value.trim().length <= 0 || !isMongoId(value)) {
      throw new BadRequestException('O valor informado precisa ser um id válido')
    }

    return value
  }
}