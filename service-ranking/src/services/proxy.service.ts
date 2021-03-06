import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

@Injectable()
export class ProxyService {
  constructor(private readonly configService: ConfigService) {}

  get adminMicroservice(): ClientProxy {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [this.configService.get<string>('RABBIT_MQ_CONNECTION_STRING')],
        queue: 'admin',
      },
    })
  }

  get challengeMicroservice(): ClientProxy {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [this.configService.get<string>('RABBIT_MQ_CONNECTION_STRING')],
        queue: 'challenge',
      },
    })
  }

  get notificationMicroservice(): ClientProxy {
    return null
  }
}