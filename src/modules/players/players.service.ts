import { Injectable, Logger } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';

import * as uuid from 'uuid'
import { UpdatePlayerDto } from './dtos/update-player.dto';

@Injectable()
export class PlayersService {
  private readonly logger = new Logger(PlayersService.name)
  private readonly players: Player[] = []

  findPlayers(): Player[] {
    return this.players
  }

  findPlayerByEmail(email: string): Player {
    return this.players.find(x => x.email === email)
  }

  createPlayer(createPlayerDto: CreatePlayerDto): Player {
    this.logger.log(`Criando jogador => ${JSON.stringify(createPlayerDto)}`)

    const { name, email, phone } = createPlayerDto
    const player: Player = {
      _id: uuid.v4(),
      name,
      email,
      phone,
      photo: null,
      position: null,
      ranking: null
    }

    this.players.push(player)

    return player
  }

  updatePlayer(id: string, updatePlayerDto: UpdatePlayerDto): void {
    this.logger.log(`Atualizando jogador => ${JSON.stringify(updatePlayerDto)}`)

    const { name, email, phone, photo } = updatePlayerDto
    const index = this.players.findIndex(x => x._id === id)

    if (index === -1) {
      return
    }

    const player = this.players[index]

    this.players[index] = {
      ...player,
      name,
      email,
      phone,
      photo,
    }
  }

  deletePlayer(id: string): void {
    const index = this.players.findIndex(x => x._id === id)

    if (index === -1) {
      return
    }

    this.players.splice(index, 1)
  }
}
