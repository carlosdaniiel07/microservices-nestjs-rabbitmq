import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk'

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name)

  constructor(private configService: ConfigService) {

  }

  public async uploadFile(file: any, userId: string): Promise<string> {
    const s3 = new AWS.S3({ region: this.configService.get<string>('AWS_S3_BUCKET_REGION') })

    const fileExtension = file.originalname.split('.')[1]
    const fileKey = `${userId}_${Date.now()}.${fileExtension}`

    this.logger.log(`Realizando upload de arquivo no Amazon S3 => ${fileKey}`)

    try {
      const response = await s3.upload({
        Bucket: this.configService.get<string>('AWS_S3_BUCKET_NAME'),
        Body: file.buffer,
        Key: fileKey,
        ACL: 'public-read',
      }).promise()

      return response.Location
    } catch (err) {
      this.logger.error('Ocorreu um erro ao realizar o upload do arquivo no Amazon S3')
      throw err
    }
  }
}
