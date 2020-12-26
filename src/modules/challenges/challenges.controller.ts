import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { CreateChallengeDto } from './dtos/create-challenge.dto'

@Controller('api/v1/challenges')
export class ChallengesController {
  constructor(private readonly service: ChallengesService) {

  }

  @Post()
  @UsePipes(ValidationPipe)
  async createChallenge(@Body() createChallengeDto: CreateChallengeDto): Promise<any> {
    return await this.service.save(createChallengeDto)
  }
}
