import { Injectable, Logger } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateRankingDto } from "src/dtos/ranking/create-ranking.dto";
import { GetRankingDto } from "src/dtos/ranking/get-ranking.dto";
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

  async getRanking(categoryName: string, referenceDate = new Date()): Promise<GetRankingDto[]> {
    this.logger.log('Construindo o ranking...')

    const category = await this.proxyService.adminMicroservice.send('find-category-by-name', categoryName).toPromise<Category>()
    
    if (!category) {
      throw new RpcException('Categoria não encontrada')
    }

    referenceDate = new Date(referenceDate)
    referenceDate.setUTCHours(23)
    referenceDate.setUTCMinutes(59)
    referenceDate.setUTCSeconds(59)
    referenceDate.setUTCMilliseconds(999)

    const ranking = await this.rankingModel.find({ category: category._id, createdAt: { $lte: referenceDate } })
    const rankingResult: GetRankingDto[] = []
    const players = new Set<string>(ranking.map(({ player }) => `${player}`))

    players.forEach(player => {
      let wins = 0
      let defeats = 0
      let totalPoints = 0

      ranking.filter(ranking => `${ranking.player}` === player).forEach(x => {
        const isWin = ['VITORIA', 'VITORIA_LIDER'].includes(x.event)

        if (isWin) {
          wins += 1
          totalPoints += x.points
        } else {
          defeats += 1
          totalPoints -= x.points
        }
      })

      rankingResult.push({
        player: player,
        points: totalPoints,
        history: {
          wins: wins,
          defeats: defeats,
        },
      })
    })

    const response: GetRankingDto[] = rankingResult.sort(this.sortRanking).map((ranking, index) => ({
      position: index + 1,
      ...ranking,
    }))

    this.logger.log('Ranking construído com sucesso!')

    return response
  }

  async getFirstOfRanking(categoryName: string, referenceDate: Date): Promise<GetRankingDto> {
    const rankingResult = await this.getRanking(categoryName, referenceDate)
    
    if (!rankingResult.length) {
      return null
    }

    return rankingResult[0]
  }

  async save(matchId: string): Promise<void> {
    this.logger.log('Gerando ranking...')

    const createRankingDtos: CreateRankingDto[] = []

    const match = await this.proxyService.challengeMicroservice.send('find-match-by-id', matchId).toPromise<Match>()
    const category = await this.proxyService.adminMicroservice.send('find-category-by-name', match.category).toPromise<Category>()
    const firstOfRanking = await this.getFirstOfRanking(category.name, new Date())

    match.players.forEach(player => {
      const isWinner = player === match.winner
      const defeatedPlayer = match.players.find(playerId => playerId !== match.winner)

      const { name, operation, value } = category.events.find(({ name }) => name === (
        isWinner ? defeatedPlayer === firstOfRanking.player ? 'VITORIA_LIDER' : 'VITORIA' : 'DERROTA'
      ))

      createRankingDtos.push({
        category: category._id,
        match: match._id,
        player: player,
        event: name,
        operation: operation,
        points: value,
      })
    })

    for (const createRankingDto of createRankingDtos.values()) {
      await new this.rankingModel(createRankingDto).save()
    }

    this.logger.log('Ranking gerado com sucesso!')
  }

  private sortRanking(a: GetRankingDto, b: GetRankingDto): number {
    const sortByWins = (a: GetRankingDto, b: GetRankingDto): number => {
      const aWins = a.history.wins
      const bWins = b.history.wins

      return aWins > bWins ? -1 : aWins < bWins ? 1 : 0
    }

    return a.points > b.points ? -1 : a.points < b.points ? 1 : sortByWins(a, b)
  }
}