import { Body, Controller, Get, Logger, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { Observable } from 'rxjs';
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

  @Get('categories')
  findCategories(): Observable<any[]> {
    return this.adminMicroservice.send('find-all-categories', '')
  }

  @Get('categories/:id')
  findCategoryById(@Param('id') id: string): Observable<any> {
    return this.adminMicroservice.send('find-category-by-id', id)
  }

  @Post('categories')
  @UsePipes(ValidationPipe)
  saveCategory(@Body() createCategoryDto: CreateCategoryDto): void {
    this.adminMicroservice.emit('create-category', createCategoryDto)
  }
}
