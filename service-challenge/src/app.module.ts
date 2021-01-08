import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { ChallengeSchema } from './interfaces/challenges/challenge.schema';
import { MatchSchema } from './interfaces/matches/match.schema';
import { ChallengesService } from './services/challenges.service';
import { ProxyService } from './services/proxy.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('APP_CONNECTION_STRING'),
        appname: 'Smart Ranking - CHALLENGE',
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      }),
    }),
    MongooseModule.forFeature([
      { name: 'Challenge', schema: ChallengeSchema },
      { name: 'Match', schema: MatchSchema },
    ])
  ],
  controllers: [AppController],
  providers: [
    ChallengesService,
    ProxyService,
  ]
})
export class AppModule {}
