import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoriesService } from '../categories/categories.service';
import { Category } from '../categories/interface/category.interface';
import { Player } from '../players/interfaces/player.interface';
import { PlayersService } from '../players/players.service';
import { CreateChallengeDto } from './dtos/create-challenge.dto';
import { ChallengeStatus } from './enums/challenge-status.enum';
import { Challenge } from './interfaces/challenge.interface';

@Injectable()
export class ChallengesService {
  private readonly logger = new Logger(ChallengesService.name)

  constructor(
    @InjectModel('Challenge') private readonly challengeModel: Model<Challenge>,
    private readonly playersService: PlayersService,
    private readonly categoriesService: CategoriesService,
    ) {}

  async findAll(): Promise<Challenge[]> {
    return await this.challengeModel.find()
  }

  async findById(id: string): Promise<Challenge> {
    const challenge = await this.challengeModel.findById(id)

    if (!challenge) {
      throw new NotFoundException('Desafio não encontrado')
    }

    return challenge
  }

  async save(createChallengeDto: CreateChallengeDto): Promise<any> {
    this.logger.log(`Criando desafio => ${JSON.stringify(createChallengeDto)}`)

    const requester = await this.playersService.findById(createChallengeDto.requester._id)
    const players: Player[] = []

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for(const player of createChallengeDto.players.values()) {
      players.push(await this.playersService.findById(player._id))
    }

    const [firstPlayer, secondPlayer] = players

    if (players.length !== 2 || firstPlayer.id === secondPlayer.id) {
      throw new BadRequestException('O desafio precisa ser composto por jogadores distintos')
    }

    if (!players.map(({ id }) => id).includes(requester.id)) {
      throw new BadRequestException('O jogador solicitante precisa fazer parte do desafio')
    }

    const categories: Category[] = []

    for(const player of players.values()) {
      categories.push(await this.categoriesService.findByPlayer(player))
    }

    if (!categories.every(category => !!category)) {
      throw new BadRequestException('Nem todos os jogadores estão vinculados a uma categoria')
    }

    const [firstCategory, secondCategory] = categories

    if (firstCategory.id !== secondCategory.id) {
      throw new BadRequestException('Os jogadores precisam pertencer a mesma categoria')
    }
    
    const createdChallenge = await new this.challengeModel({
      category: firstCategory.name,
      date: createChallengeDto.date,
      status: ChallengeStatus.PENDING,
      requestDate: new Date(),
      responseDate: null,
      requester,
      players,
      match: null,
    }).save()

    this.logger.log('Desafio criado com sucesso!')

    return createdChallenge
  }
}
