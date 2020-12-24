import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { UpdatePlayerDto } from './dtos/update-player.dto';
import { Player } from './interfaces/player.interface';
import { PlayersService } from './players.service';
@Controller('api/v1/players')
export class PlayersController {
  constructor(private service: PlayersService) {

  }

  @Get()
  async findPlayers(@Query('email') email: string): Promise<Player | Player[]> {
    if (email) {
      return await this.service.findPlayerByEmail(email)
    } else {
      return await this.service.findPlayers()
    }
  }

  @Post()
  async createPlayer(@Body() createPlayerDto: CreatePlayerDto): Promise<Player> {
    return await this.service.createPlayer(createPlayerDto)
  }

  @Put(':id')
  async updatePlayer(@Param() params: any, @Body() updatePlayerDto: UpdatePlayerDto): Promise<Player> {
    return await this.service.updatePlayer(params.id, updatePlayerDto)
  }

  @Delete(':id')
  async deletePlayer(@Param() params: any): Promise<void> {
    await this.service.deletePlayer(params.id)
  }
}
