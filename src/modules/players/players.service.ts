import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';

import { UpdatePlayerDto } from './dtos/update-player.dto';

@Injectable()
export class PlayersService {
  private readonly logger = new Logger(PlayersService.name)
  private readonly players: Player[] = []

  constructor(@InjectModel('Player') private readonly playerModel: Model<Player>) {

  }

  async findPlayers(): Promise<Player[]> {
    return this.playerModel.find().exec()
  }

  async findPlayerByEmail(email: string): Promise<Player> {
    return await this.playerModel.findOne({ email }).exec()
  }

  async createPlayer(createPlayerDto: CreatePlayerDto): Promise<Player> {
    this.logger.log(`Criando jogador => ${JSON.stringify(createPlayerDto)}`)
    return await new this.playerModel(createPlayerDto).save()
  }

  async updatePlayer(id: string, updatePlayerDto: UpdatePlayerDto): Promise<Player> {
    this.logger.log(`Atualizando jogador => ${JSON.stringify(updatePlayerDto)}`)
    return await this.playerModel.findByIdAndUpdate(id, updatePlayerDto).exec()
  }

  async deletePlayer(id: string): Promise<void> {
    this.logger.log(`Removendo jogador => ${id}`)
    await this.playerModel.findByIdAndRemove(id).exec()
  }
}
