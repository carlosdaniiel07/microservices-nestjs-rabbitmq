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
  findPlayers(@Query('email') email: string): Player | Player[] {
    if (email) {
      return this.service.findPlayerByEmail(email)
    } else {
      return this.service.findPlayers()
    }
  }

  @Post()
  createPlayer(@Body() createPlayerDto: CreatePlayerDto): Player {
    return this.service.createPlayer(createPlayerDto)
  }

  @Put(':id')
  updatePlayer(@Param() params: any, @Body() updatePlayerDto: UpdatePlayerDto): void {
    return this.service.updatePlayer(params.id, updatePlayerDto)
  }

  @Delete(':id')
  deletePlayer(@Param() params: any): void {
    return this.service.deletePlayer(params.id)
  }
}
