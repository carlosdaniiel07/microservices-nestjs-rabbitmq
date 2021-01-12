import { Injectable, Logger } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateRankingDto } from "src/dtos/ranking/create-ranking.dto";
import { Ranking } from "src/interfaces/ranking/ranking.interface";
import { ProxyService } from "./proxy.service";

@Injectable()
export class RankingService {
  private readonly logger = new Logger(RankingService.name)

  constructor(
    @InjectModel('Ranking') private readonly rankingModel: Model<Ranking>, 
    private readonly proxyService: ProxyService,
  ) {}

  async save(createRankingDto: CreateRankingDto): Promise<Ranking> {
    if (!['+', '-'].includes(createRankingDto.operation)) {
      throw new RpcException(`A operação ${createRankingDto.operation} não é válida`)
    }

    if (createRankingDto.points < 0) {
      throw new RpcException('Pontos não podem ser negativos')
    }

    return await new this.rankingModel(createRankingDto).save()
  }
}