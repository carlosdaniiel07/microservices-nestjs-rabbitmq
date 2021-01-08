import { Controller, Get, Logger } from '@nestjs/common';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { CreateChallengeDto } from './dtos/challenges/create-challenge.dto';
import { Challenge } from './interfaces/challenges/challenge.interface';
import { ChallengesService } from './services/challenges.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name)

  constructor(private readonly challengeService: ChallengesService) {}

  @MessagePattern('find-all-challenges')
  async handleFindAllChallenges(@Ctx() context: RmqContext): Promise<Challenge[]> {
    await this.ackMessage(context)
    return await this.challengeService.findAll()
  }

  @MessagePattern('find-challenge-by-id')
  async handleFindChallengeById(@Payload() id: string, @Ctx() context: RmqContext): Promise<Challenge> {
    await this.ackMessage(context)
    return await this.challengeService.findById(id)
  }

  @EventPattern('create-challenge')
  async handleCreateChallenge(@Payload() createChallengeDto: CreateChallengeDto, @Ctx() context: RmqContext): Promise<void> {
    await this.challengeService.save(createChallengeDto)
    await this.ackMessage(context)
  }

  private async ackMessage(context: RmqContext): Promise<void> {
    const channel = context.getChannelRef()
    const message = context.getMessage()

    await channel.ack(message)
  }
}
