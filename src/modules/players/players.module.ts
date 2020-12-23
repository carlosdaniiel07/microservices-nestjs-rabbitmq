import { Module } from '@nestjs/common';
import { PlayersController } from './players.controller';

@Module({
  controllers: [PlayersController],
  providers: [],
  imports: [],
  exports: [],
})
export class PlayersModule {}
