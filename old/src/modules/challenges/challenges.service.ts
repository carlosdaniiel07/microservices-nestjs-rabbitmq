import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoriesService } from '../categories/categories.service';
import { Category } from '../categories/interface/category.interface';
import { Player } from '../players/interfaces/player.interface';
import { PlayersService } from '../players/players.service';
import { AssignChallengeMatchDto } from './dtos/assign-challenge-match.dto';
import { CreateChallengeDto } from './dtos/create-challenge.dto';
import { UpdateChallengeDto } from './dtos/update-challenge.dto';
import { ChallengeStatus } from './enums/challenge-status.enum';
import { Challenge } from './interfaces/challenge.interface';
import { Match } from './interfaces/match.interface';

@Injectable()
export class ChallengesService {
  private readonly logger = new Logger(ChallengesService.name)

  constructor(
    @InjectModel('Challenge') private readonly challengeModel: Model<Challenge>,
    @InjectModel('Match') private readonly matchModel: Model<Match>,
    private readonly playersService: PlayersService,
    private readonly categoriesService: CategoriesService,
    ) {}

  async findAll(): Promise<Challenge[]> {
    return await this.challengeModel.find().populate('players')
  }

  async findByRequester(id: string): Promise<Challenge[]> {
    const player = await this.playersService.findById(id)
    return await this.challengeModel.find({ requester: player }).populate('players')    
  }
  
  async findById(id: string): Promise<Challenge> {
    const challenge = await this.challengeModel.findById(id).populate('players')

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
      requester,
      players,
    }).save()

    this.logger.log('Desafio criado com sucesso!')

    return createdChallenge
  }

  async update(id: string, updateChallengeDto: UpdateChallengeDto): Promise<void> {
    const challenge = await this.findById(id)

    if (challenge.status === ChallengeStatus.FINISHED) {
      throw new BadRequestException('Este desafio já foi finalizado e não pode ser alterado')
    }

    if (![ChallengeStatus.ACCEPTED, ChallengeStatus.REJECTED, ChallengeStatus.CANCELLED].includes(updateChallengeDto.status)) {
      throw new BadRequestException('O desafio não pode ser alterado para este status')
    }

    await this.challengeModel.updateOne({ _id: id }, updateChallengeDto)
  }

  async assignMatch(challengeId: string, assignChallengeMatchDto: AssignChallengeMatchDto): Promise<void> {
    const { date, winner, results } = assignChallengeMatchDto
    
    const challenge = await this.findById(challengeId)

    if (challenge.match) {
      throw new BadRequestException('Uma partida já foi vinculada a este desafio')
    }
    
    if (!challenge.players.map(({ id }) => id).includes(winner._id)) {
      throw new BadRequestException('Este jogador não faz parte do desafio')
    }

    const match = await new this.matchModel({
      category: challenge.category,
      date,
      winner,
      results,
      players: challenge.players,
    }).save()

    await this.challengeModel.updateOne({ _id: challengeId }, {
      status: ChallengeStatus.FINISHED,
      match,
    })
  }
}
