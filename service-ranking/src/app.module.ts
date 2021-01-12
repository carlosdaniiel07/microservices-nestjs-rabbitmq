import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { RankingSchema } from './interfaces/ranking/ranking.schema';
import { ProxyService } from './services/proxy.service';
import { RankingService } from './services/ranking.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('APP_CONNECTION_STRING'),
        appname: 'Smart Ranking - RANKING',
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      }),
    }),
    MongooseModule.forFeature([
      { name: 'Ranking', schema: RankingSchema },
    ])
  ],
  controllers: [AppController],
  providers: [
    ProxyService,
    RankingService,
  ]
})
export class AppModule {}
