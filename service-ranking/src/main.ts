import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { RpcExceptionFilter } from './filters/rpc-exception.filter';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://guest:guest@192.168.99.100:5672/smart-ranking'],
      queue: 'ranking',
      queueOptions: {
        durable: true,
      },
      noAck: false,
    },
  })

  app.useGlobalFilters(new RpcExceptionFilter())

  await app.listenAsync()
}
bootstrap();
