import { Body, Controller, Get, Logger, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { CreateCategoryDto } from './dtos/categories/create-category.dto';
import { UpdateCategoryDto } from './dtos/categories/update-category.dto';
import { ParamsValidationPipe } from './pipes/pipes/params-validation.pipe';

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
  findCategoryById(@Param('id', ParamsValidationPipe) id: string): Observable<any> {
    return this.adminMicroservice.send('find-category-by-id', id)
  }

  @Post('categories')
  @UsePipes(ValidationPipe)
  saveCategory(@Body() createCategoryDto: CreateCategoryDto): void {
    this.adminMicroservice.emit('create-category', createCategoryDto)
  }

  @Put('categories/:id')
  @UsePipes(ValidationPipe)
  updateCategory(@Param('id', ParamsValidationPipe) id: string, @Body() updateCategoryDto: UpdateCategoryDto): void {
    this.adminMicroservice.emit('update-category', { id, data: updateCategoryDto })
  }

  @Post('categories/:id/players/:playerId')
  addPlayerToCategory(@Param('id', ParamsValidationPipe) id: string, @Param('playerId', ParamsValidationPipe) playerId: string): void {
    this.adminMicroservice.emit('add-player-to-category', { id, playerId })
  }
}
