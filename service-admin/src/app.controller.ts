import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { CreateCategoryDto } from './dtos/categories/create-category.dto';
import { UpdateCategoryDto } from './dtos/categories/update-category.dto';
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
    await this.ackMessage(context)
    return await this.categoriesService.findAll()
  }

  @MessagePattern('find-category-by-id')
  async handleFindCategoryById(@Payload() id: string, @Ctx() context: RmqContext): Promise<Category> {
    await this.ackMessage(context)
    return await this.categoriesService.findById(id)
  }

  @EventPattern('create-category')
  async handleCreateCategory(@Payload() createCategoryDto: CreateCategoryDto, @Ctx() context: RmqContext): Promise<void> {
    await this.categoriesService.save(createCategoryDto)
    await this.ackMessage(context)
  }

  @EventPattern('update-category')
  async handleUpdateCategory(@Payload() payload: { id: string, data: UpdateCategoryDto }, @Ctx() context: RmqContext): Promise<void> {
    await this.categoriesService.update(payload.id, payload.data)
    await this.ackMessage(context)
  }

  @EventPattern('add-player-to-category')
  async handleAddPlayerToCategory(@Payload() payload: { id: string, playerId: string }, @Ctx() context: RmqContext): Promise<void> {
    await this.categoriesService.addPlayer(payload.id, payload.playerId)
    await this.ackMessage(context)
  }

  private async ackMessage(context: RmqContext): Promise<void> {
    const channel = context.getChannelRef()
    const message = context.getMessage()

    await channel.ack(message)
  }
}
