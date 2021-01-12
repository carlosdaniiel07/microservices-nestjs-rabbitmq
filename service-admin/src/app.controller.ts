import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { CreateCategoryDto } from './dtos/categories/create-category.dto';
import { UpdateCategoryDto } from './dtos/categories/update-category.dto';
import { CreatePlayerDto } from './dtos/players/create-player.dto';
import { UpdatePlayerDto } from './dtos/players/update-player.dto';
import { Category } from './interfaces/categories/category.interface';
import { Player } from './interfaces/players/player.interface';
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
    const response = await this.categoriesService.findAll()
    await this.ackMessage(context)

    return response
  }

  @MessagePattern('find-category-by-id')
  async handleFindCategoryById(@Payload() id: string, @Ctx() context: RmqContext): Promise<Category> {
    const response = await this.categoriesService.findById(id)
    await this.ackMessage(context)

    return response
  }

  @MessagePattern('find-category-by-name')
  async handleFindCategoryByName(@Payload() name: string, @Ctx() context: RmqContext): Promise<Category> {
    const response = await this.categoriesService.findByName(name)
    await this.ackMessage(context)

    return response
  }

  @MessagePattern('find-category-by-player')
  async handleFindCategoryByPlayer(@Payload() player: Player, @Ctx() context: RmqContext): Promise<Category> {
    const response = await this.categoriesService.findByPlayer(player)
    await this.ackMessage(context)

    return response
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

  @MessagePattern('find-all-players')
  async handleFindAllPlayers(@Ctx() context: RmqContext): Promise<Player[]> {
    const response = await this.playersService.findAll()
    await this.ackMessage(context)

    return response
  }

  @MessagePattern('find-player-by-id')
  async handleFindPlayerById(@Payload() id: string, @Ctx() context: RmqContext): Promise<Player> {
    const response = await this.playersService.findById(id)
    await this.ackMessage(context)

    return response
  }

  @EventPattern('create-player')
  async handleCreatePlayer(@Payload() createPlayerDto: CreatePlayerDto, @Ctx() context: RmqContext): Promise<void> {
    await this.playersService.save(createPlayerDto)
    await this.ackMessage(context)
  }

  @EventPattern('update-player')
  async handleUpdatePlayer(@Payload() payload: { id: string, data: UpdatePlayerDto }, @Ctx() context: RmqContext): Promise<void> {
    await this.playersService.update(payload.id, payload.data)
    await this.ackMessage(context)
  }

  @EventPattern('delete-player')
  async handleDeletePlayer(@Payload() id: string, @Ctx() context: RmqContext): Promise<void> {
    await this.playersService.delete(id)
    await this.ackMessage(context)
  }

  private async ackMessage(context: RmqContext): Promise<void> {
    const channel = context.getChannelRef()
    const message = context.getMessage()

    await channel.ack(message)
  }
}
