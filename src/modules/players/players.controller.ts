import { Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { UpdatePlayerDto } from './dtos/update-player.dto';
import { Player } from './interfaces/player.interface';
import { PlayersValidationParamsPipe } from './pipes/players-validation-params.pipe';
import { PlayersService } from './players.service';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private service: PlayersService) {

  }

  @Get()
  async findPlayers(): Promise<Player[]> {
    return await this.service.findPlayers()
  }

  @Get(':id')
  async findPlayerById(@Param('id', PlayersValidationParamsPipe) id: string): Promise<Player> {
    return await this.service.findPlayerById(id)
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createPlayer(@Body() createPlayerDto: CreatePlayerDto): Promise<Player> {
    return await this.service.createPlayer(createPlayerDto)
  }

  @Put(':id')
  async updatePlayer(@Param('id', PlayersValidationParamsPipe) id: string, @Body() updatePlayerDto: UpdatePlayerDto): Promise<void> {
    await this.service.updatePlayer(id, updatePlayerDto)
  }

  @Delete(':id')
  async deletePlayer(@Param('id', PlayersValidationParamsPipe) id: string): Promise<void> {
    await this.service.deletePlayer(id)
  }
}
