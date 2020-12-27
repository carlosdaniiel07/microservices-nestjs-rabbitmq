import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { CategorySchema } from './interfaces/categories/category.shema';
import { PlayerSchema } from './interfaces/players/player.schema';
import { CategoriesService } from './services/categories.service';
import { PlayersService } from './services/players.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('APP_CONNECTION_STRING'),
        appname: 'Smart Ranking - ADMIN',
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      }),
    }),
    MongooseModule.forFeature([
      { name: 'Player', schema: PlayerSchema },
      { name: 'Category', schema: CategorySchema },
    ])
  ],
  controllers: [AppController],
  providers: [
    CategoriesService,
    PlayersService,
  ],
})
export class AppModule {}
