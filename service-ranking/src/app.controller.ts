import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { CreateRankingDto } from './dtos/ranking/create-ranking.dto';
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

  private async ackMessage(context: RmqContext): Promise<void> {
    const channel = context.getChannelRef()
    const message = context.getMessage()

    await channel.ack(message)
  }
}
