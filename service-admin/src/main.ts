import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://guest:guest@192.168.99.100:5672/smart-ranking'],
      queue: 'admin',
      queueOptions: {
        durable: true,
      },
    },
  })

  await app.listenAsync()
}
bootstrap();
