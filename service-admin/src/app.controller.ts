import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
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
  async handleFindAllCategories(@Ctx() context: RmqContext): Promise<Category[]> {
    const channel = context.getChannelRef()

    await channel.ack(context.getMessage())
    return await this.categoriesService.findAll()
  }

  @MessagePattern('find-category-by-id')
  async handleFindCategoryById(@Payload() id: string, @Ctx() context: RmqContext): Promise<Category> {
    const channel = context.getChannelRef()

    await channel.ack(context.getMessage())
    return await this.categoriesService.findById(id)
  }

  @EventPattern('create-category')
  async handleCreateCategory(@Payload() createCategoryDto: CreateCategoryDto, @Ctx() context: RmqContext): Promise<void> {
    const channel = context.getChannelRef()

    await this.categoriesService.save(createCategoryDto)
    await channel.ack(context.getMessage())
  }
}
