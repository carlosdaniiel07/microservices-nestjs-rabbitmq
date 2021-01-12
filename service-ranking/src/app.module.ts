import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { ProxyService } from './services/proxy.service';

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
    MongooseModule.forFeature([])
  ],
  controllers: [AppController],
  providers: [
    ProxyService,
  ]
})
export class AppModule {}
