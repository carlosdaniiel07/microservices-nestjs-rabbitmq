import { Injectable, Logger } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateRankingDto } from "src/dtos/ranking/create-ranking.dto";
import { Category } from "src/interfaces/categories/category.interface";
import { Match } from "src/interfaces/matches/match.interface";
import { Ranking } from "src/interfaces/ranking/ranking.interface";
import { ProxyService } from "./proxy.service";

@Injectable()
export class RankingService {
  private readonly logger = new Logger(RankingService.name)

  constructor(
    @InjectModel('Ranking') private readonly rankingModel: Model<Ranking>,
    private readonly proxyService: ProxyService,
  ) { }

  async save(matchId: string): Promise<void> {
    this.logger.log('Gerando ranking...')

    const createRankingDtos: CreateRankingDto[] = []

    const match = await this.proxyService.challengeMicroservice.send('find-match-by-id', matchId).toPromise<Match>()
    const category = await this.proxyService.adminMicroservice.send('find-category-by-name', match.category).toPromise<Category>()

    match.players.forEach(player => {
      const isWinner = player === match.winner
      const { name, operation, value } = category.events.find(({ name }) => name === (isWinner ? 'VITORIA' : 'DERROTA'))

      createRankingDtos.push({
        category: category._id,
        player: player,
        event: name,
        operation: operation,
        points: value,
      })
    })

    for(const createRankingDto of createRankingDtos.values()) {
      await new this.rankingModel(createRankingDto).save()
    }

    this.logger.log('Ranking gerado com sucesso!')
  }
}