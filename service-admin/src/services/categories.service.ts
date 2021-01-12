import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCategoryDto } from 'src/dtos/categories/create-category.dto';
import { UpdateCategoryDto } from 'src/dtos/categories/update-category.dto';
import { Category } from 'src/interfaces/categories/category.interface';
import { Player } from 'src/interfaces/players/player.interface';
import { PlayersService } from './players.service';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name)

  constructor (
    @InjectModel('Category') private readonly categoryModel: Model<Category>,
    private readonly playersService: PlayersService,
  ) {}

  async findAll(): Promise<Category[]> {
    return await this.categoryModel.find().populate('players')
  }

  async findById(id: string): Promise<Category> {
    const category = await this.categoryModel.findById(id).populate('players').exec()

    if (!category) {
      throw new RpcException('Categoria não encontrada')
    }

    return category
  }

  async findByName(name: string): Promise<Category> {
    const category = await this.categoryModel.findOne({ name }).populate('players').exec()

    if (!category) {
      throw new RpcException('Categoria não encontrada')
    }

    return category
  }

  async findByPlayer(player: Player): Promise<Category> {
    return await this.categoryModel.findOne({ players: { $in: [player] } })
  }

  async save(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const { name } = createCategoryDto
    const exists = (await this.categoryModel.countDocuments({ name }) as number) > 0

    if (exists) {
      throw new RpcException(`Já existe uma categroia cadastrada com o nome ${name}`)
    }

    if (!this.isValidEvents(createCategoryDto)) {
      throw new RpcException('As operações permitidas são somente adição e subtração')
    }

    return new this.categoryModel(createCategoryDto).save()
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<void> {
    const category = await this.findById(id)

    if (!this.isValidEvents(updateCategoryDto)) {
      throw new RpcException('As operações permitidas são somente adição e subtração')
    }

    category.description = updateCategoryDto.description
    category.events = updateCategoryDto.events
    
    await this.categoryModel.updateOne({ _id: id }, category)
  }

  async addPlayer(categoryId: string, playerId: string): Promise<void> {
    const category = await this.findById(categoryId)
    const player = await this.playersService.findById(playerId)

    if (category.players.find(x => x._id as string == playerId)) {
      throw new RpcException(`Este jogador já está na categoria ${category.name}`)
    }

    category.players.push(player)

    await this.categoryModel.updateOne({ _id: categoryId }, category)
  }

  private isValidEvents = (category: CreateCategoryDto | UpdateCategoryDto): boolean  => {
    if (!category || !category.events || !category.events.length) {
      return false
    }

    return category.events.every(x => ['+', '-'].includes(x.operation))
  }
}
