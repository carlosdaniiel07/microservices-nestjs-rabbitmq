import { Controller, Logger } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { CreateCategoryDto } from './dtos/categories/create-category.dto';
import { Category } from './interfaces/categories/category.interface';
import { CategoriesService } from './services/categories.service';
import { PlayersService } from './services/players.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name)
  
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly playersService: PlayersService,
  ) {}

  @MessagePattern('find-all-categories')
  async findAllCategories(): Promise<Category[]> {
    return await this.categoriesService.findAll()
  }

  @MessagePattern('find-category-by-id')
  async findCategoryById(@Payload() id: string): Promise<Category> {
    return await this.categoriesService.findById(id)
  }

  @EventPattern('create-category')
  async handleCreateCategory(@Payload() createCategoryDto: CreateCategoryDto): Promise<void> {
    await this.categoriesService.save(createCategoryDto)
  }
}
