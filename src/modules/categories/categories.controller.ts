import { Body, Controller, Get, HttpCode, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { Category } from './interface/category.interface';

@Controller('api/v1/categories')
export class CategoriesController {
  constructor(private readonly service: CategoriesService) {
  
  }

  @Get()
  async findCategories(): Promise<Category[]> {
    return await this.service.findAll()
  }

  @Get(':id')
  async findCategoryById(@Param('id') id: string): Promise<Category> {
    return await this.service.findById(id)
  }

  @Post()
  @UsePipes(ValidationPipe)
  async saveCategory(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    return await this.service.save(createCategoryDto)
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
  async updateCategory(@Param('id') id: string, @Body() updateCategoryDto: any): Promise<void> {
    await this.service.update(id, updateCategoryDto)
  }

  @Post(':id/players/:playerId')
  async addPlayerToCategory(@Param('id') categoryId: string, @Param('playerId') playerId: string): Promise<void> {
    await this.service.addPlayer(categoryId, playerId)
  }
}
