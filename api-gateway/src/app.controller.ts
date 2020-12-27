import { Body, Controller, Logger, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { CreateCategoryDto } from './dtos/categories/create-category.dto';

@Controller('api/v1')
export class AppController {
  private readonly logger = new Logger(AppController.name)
  private readonly adminMicroservice: ClientProxy = null

  constructor() {
    this.adminMicroservice = ClientProxyFactory.create({
      transport: Transport.RMQ, options: {
        urls: ['amqp://guest:guest@192.168.99.100:5672/smart-ranking'],
        queue: 'admin',
      }
    })
  }

  @Post('categories')
  @UsePipes(ValidationPipe)
  async saveCategory(@Body() createCategoryDto: CreateCategoryDto): Promise<any> {
    return this.adminMicroservice.emit('create-category', createCategoryDto)
  }
}
