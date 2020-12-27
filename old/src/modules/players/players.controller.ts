import { Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { UpdatePlayerDto } from './dtos/update-player.dto';
import { Player } from './interfaces/player.interface';
import { ParamsValidationPipe } from '../../common/pipes/params-validation.pipe';
import { PlayersService } from './players.service';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private service: PlayersService) {

  }

  @Get()
  async findPlayers(): Promise<Player[]> {
    return await this.service.findAll()
  }

  @Get(':id')
  async findPlayerById(@Param('id', ParamsValidationPipe) id: string): Promise<Player> {
    return await this.service.findById(id)
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createPlayer(@Body() createPlayerDto: CreatePlayerDto): Promise<Player> {
    return await this.service.save(createPlayerDto)
  }

  @Put(':id')
  async updatePlayer(@Param('id', ParamsValidationPipe) id: string, @Body() updatePlayerDto: UpdatePlayerDto): Promise<void> {
    await this.service.update(id, updatePlayerDto)
  }

  @Delete(':id')
  async deletePlayer(@Param('id', ParamsValidationPipe) id: string): Promise<void> {
    await this.service.delete(id)
  }
}
