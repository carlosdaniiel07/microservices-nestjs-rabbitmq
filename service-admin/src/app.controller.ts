import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CreateCategoryDto } from './dtos/categories/create-category.dto';
import { CategoriesService } from './services/categories.service';
import { PlayersService } from './services/players.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name)
  
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly playersService: PlayersService,
  ) {}

  @EventPattern('create-category')
  async handleCreateCategory(@Payload() createCategoryDto: CreateCategoryDto): Promise<any> {
    await this.categoriesService.save(createCategoryDto)
  }
}
