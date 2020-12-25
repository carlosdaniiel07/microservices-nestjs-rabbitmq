import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'
import { PlayerSchema } from './interfaces/player.schema';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';

@Module({
  controllers: [PlayersController],
  providers: [PlayersService],
  imports: [
    MongooseModule.forFeature([
      { name: 'Player', schema: PlayerSchema },
    ])
  ],
  exports: [PlayersService],
})
export class PlayersModule {}
