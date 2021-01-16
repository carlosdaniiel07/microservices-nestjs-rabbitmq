import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { GetRankingDto } from './dtos/ranking/get-ranking.dto';
import { RankingService } from './services/ranking.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name)

  constructor(
    private readonly service: RankingService
  ) {}

  @EventPattern('create-ranking')
  async handleSaveRanking(@Payload() matchId: string, @Ctx() context: RmqContext): Promise<void> {
    await this.service.save(matchId)
    await this.ackMessage(context)
  }

  @MessagePattern('get-ranking')
  async handleGetRanking(@Payload() payload: { categoryName: string, referenceDate: Date }, @Ctx() context: RmqContext): Promise<GetRankingDto[]> {
    const data = await this.service.getRanking(payload.categoryName, payload.referenceDate)
    await this.ackMessage(context)
    
    return data
  }

  @MessagePattern('get-first-of-ranking')
  async handleGetFirstOfRanking(@Payload() payload: { categoryName: string, referenceDate: Date }, @Ctx() context: RmqContext): Promise<GetRankingDto> {
    const data = await this.service.getFirstOfRanking(payload.categoryName, payload.referenceDate)
    await this.ackMessage(context)

    return data
  }

  private async ackMessage(context: RmqContext): Promise<void> {
    const channel = context.getChannelRef()
    const message = context.getMessage()

    await channel.ack(message)
  }
}
