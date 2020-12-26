import { Body, Controller, Get, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ParamsValidationPipe } from 'src/common/pipes/params-validation.pipe';
import { ChallengesService } from './challenges.service';
import { AssignChallengeMatchDto } from './dtos/assign-challenge-match.dto';
import { CreateChallengeDto } from './dtos/create-challenge.dto'
import { UpdateChallengeDto } from './dtos/update-challenge.dto';
import { Challenge } from './interfaces/challenge.interface';

@Controller('api/v1/challenges')
export class ChallengesController {
  constructor(private readonly service: ChallengesService) {

  }

  @Get()
  async findChallenges(@Query('player') player: string): Promise<Challenge[]> {
    const challenges = player ? await this.service.findByRequester(player) : await this.service.findAll()
    return challenges
  }

  @Get(':id')
  async findChallengeById(@Param('id', ParamsValidationPipe) id: string): Promise<Challenge> {
    return await this.service.findById(id)
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createChallenge(@Body() createChallengeDto: CreateChallengeDto): Promise<Challenge> {
    return await this.service.save(createChallengeDto)
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
  async updateChallenge(
    @Param('id', ParamsValidationPipe) id: string,
    @Body() updateChallengeDto: UpdateChallengeDto
  ): Promise<void> {
    await this.service.update(id, updateChallengeDto)
  }

  @Post(':id/match')
  @UsePipes(ValidationPipe)
  async assignMatch(
    @Param('id', ParamsValidationPipe) id: string,
    @Body() assignChallengeMatchDto: AssignChallengeMatchDto
  ): Promise<void> {
    await this.service.assignMatch(id, assignChallengeMatchDto)
  }
}
