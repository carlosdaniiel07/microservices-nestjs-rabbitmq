import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePlayerDto } from 'src/dtos/players/create-player.dto';
import { UpdatePlayerDto } from 'src/dtos/players/update-player.dto';
import { Player } from 'src/interfaces/players/player.interface';

@Injectable()
export class PlayersService {
  private readonly logger = new Logger(PlayersService.name)

  constructor(@InjectModel('Player') private readonly playerModel: Model<Player>) {

  }

  async findAll(): Promise<Player[]> {
    return this.playerModel.find().exec()
  }

  async findByEmail(email: string): Promise<Player> {
    const player = await this.playerModel.findOne({ email }).exec()

    if (!player) {
      throw new RpcException(`Não existe nenhum jogador com o e-mail ${email}`)
    }

    return player
  }

  async findById(id: string): Promise<Player> {
    const player = await this.playerModel.findById(id).exec()

    if (!player) {
      throw new RpcException('Jogador não encontrado')
    }

    return player
  }

  async save(createPlayerDto: CreatePlayerDto): Promise<Player> {
    this.logger.log(`Criando jogador => ${JSON.stringify(createPlayerDto)}`)
    
    const exists = (await this.playerModel.countDocuments({ email: createPlayerDto.email }) as number) > 0

    if (exists) {
      throw new RpcException(`Já existe um jogador com o e-mail ${createPlayerDto.email}`)
    }

    return await new this.playerModel(createPlayerDto).save()
  }

  async update(id: string, updatePlayerDto: UpdatePlayerDto): Promise<void> {
    this.logger.log(`Atualizando jogador => ${JSON.stringify(updatePlayerDto)}`)
    
    await this.findById(id)
    
    const exists = (await this.playerModel.countDocuments({ _id: { $ne: id }, email: updatePlayerDto.email }) as number) > 0

    if (exists) {
      throw new RpcException(`Já existe um jogador com o e-mail ${updatePlayerDto.email}`)
    }
    
    await this.playerModel.updateOne({ _id: id }, updatePlayerDto).exec()
  }

  async delete(id: string): Promise<void> {
    this.logger.log(`Removendo jogador => ${id}`)
    
    await this.findById(id)
    await this.playerModel.remove({ _id: id })
  }
}
