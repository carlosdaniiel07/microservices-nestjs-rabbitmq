import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AssignChallengeMatchDto } from 'src/dtos/challenges/assign-challenge-match.dto';
import { CreateChallengeDto } from 'src/dtos/challenges/create-challenge.dto';
import { UpdateChallengeDto } from 'src/dtos/challenges/update-challenge.dto';
import { SendEmailDto } from 'src/dtos/notification/send-email.dto';
import { ChallengeStatus } from 'src/enums/challenge-status.enum';
import { Category } from 'src/interfaces/categories/category.interface';
import { Challenge } from 'src/interfaces/challenges/challenge.interface';
import { Match } from 'src/interfaces/matches/match.interface';
import { Player } from 'src/interfaces/players/player.interface';
import { ProxyService } from './proxy.service';

@Injectable()
export class ChallengesService {
  private readonly logger = new Logger(ChallengesService.name)

  constructor(
    @InjectModel('Challenge') private readonly challengeModel: Model<Challenge>,
    @InjectModel('Match') private readonly matchModel: Model<Match>,
    private readonly proxyService: ProxyService
  ) { }

  async findAll(): Promise<Challenge[]> {
    return await this.challengeModel.find().populate('match')
  }

  async findByRequester(id: string): Promise<Challenge[]> {
    const player = await this.proxyService.adminMicroservice.send<Player>('find-player-by-id', id).toPromise()
    return await this.challengeModel.find({ requester: player }).populate('match')
  }

  async findById(id: string): Promise<Challenge> {
    const challenge = await this.challengeModel.findById(id).populate('match')

    if (!challenge) {
      throw new RpcException('Desafio não encontrado')
    }

    return challenge
  }

  async findMatchById(id: string): Promise<Match> {
    const match = await this.matchModel.findById(id)

    if (!match) {
      throw new RpcException('Partida não encontrada')
    }

    return match
  }

  async save(createChallengeDto: CreateChallengeDto): Promise<any> {
    this.logger.log(`Criando desafio => ${JSON.stringify(createChallengeDto)}`)

    const requester = await this.proxyService.adminMicroservice.send<Player>('find-player-by-id', createChallengeDto.requester._id).toPromise()
    const players: Player[] = []

    for (const value of createChallengeDto.players.values()) {
      const player = await this.proxyService.adminMicroservice.send<Player>('find-player-by-id', value._id).toPromise()
      players.push(player)
    }

    const [firstPlayer, secondPlayer] = players

    if (players.length !== 2 || firstPlayer._id === secondPlayer._id) {
      throw new RpcException('O desafio precisa ser composto por jogadores distintos')
    }

    if (!players.map(({ id }) => id).includes(requester.id)) {
      throw new RpcException('O jogador solicitante precisa fazer parte do desafio')
    }

    const categories: Category[] = []

    for (const value of players.values()) {
      const category = await this.proxyService.adminMicroservice.send<Category>('find-category-by-player', value).toPromise()
      categories.push(category)
    }

    if (!categories.every(category => !!category)) {
      throw new RpcException('Nem todos os jogadores estão vinculados a uma categoria')
    }

    const [firstCategory, secondCategory] = categories

    if (firstCategory.id !== secondCategory.id) {
      throw new RpcException('Os jogadores precisam pertencer a mesma categoria')
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

    const challengedPlayer = players.find(p => p._id !== requester._id)

    await this.proxyService.notificationMicroservice.emit<any, SendEmailDto>('send-email', {
      to: challengedPlayer.email,
      subject: `O jogador ${requester.name.trim()} desafiou você para uma partida`,
      content: `
        Você foi desafiado pelo jogador ${requester.name.trim()} e tem exatamente 5 dias a partir de agora para aceitar ou negar o desafio.
        Acesse o sistema através do login abaixo
      `,
    }).toPromise()

    return createdChallenge
  }

  async update(id: string, updateChallengeDto: UpdateChallengeDto): Promise<void> {
    const challenge = await this.findById(id)

    if (challenge.status === ChallengeStatus.FINISHED) {
      throw new RpcException('Este desafio já foi finalizado e não pode ser alterado')
    }

    if (![ChallengeStatus.ACCEPTED, ChallengeStatus.REJECTED, ChallengeStatus.CANCELLED].includes(updateChallengeDto.status)) {
      throw new RpcException('O desafio não pode ser alterado para este status')
    }

    await this.challengeModel.updateOne({ _id: id }, updateChallengeDto)
  }

  async assignMatch(challengeId: string, assignChallengeMatchDto: AssignChallengeMatchDto): Promise<void> {
    this.logger.log('Vinculando partida...')

    const { date, winner, results } = assignChallengeMatchDto

    const challenge = await this.findById(challengeId)

    if (challenge.match) {
      throw new RpcException('Uma partida já foi vinculada a este desafio')
    }

    if (challenge.status !== ChallengeStatus.ACCEPTED) {
      throw new RpcException('Uma partida não pode ser atribuida para este desafio')
    }

    if (!challenge.players.includes(winner._id)) {
      throw new RpcException('Este jogador não faz parte do desafio')
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

    this.logger.log('Partida vinculada com sucesso')

    this.proxyService.rankingMicroservice.emit('create-ranking', match._id)
  }
}
