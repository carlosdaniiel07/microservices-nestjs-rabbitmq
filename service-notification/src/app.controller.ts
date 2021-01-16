import { Controller, Get, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { SendEmailDto } from './dto/send-email.dto';
import { NotificationService } from './services/notification/notification.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name)
  
  constructor(private readonly service: NotificationService) {}

  @EventPattern('send-email')
  async handleSendEmail(@Payload() payload: SendEmailDto, @Ctx() context: RmqContext): Promise<void> {
    this.service.sendEmail(payload)
    this.ackMessage(context)
  }

  private async ackMessage(context: RmqContext): Promise<void> {
    const channel = context.getChannelRef()
    const message = context.getMessage()

    await channel.ack(message)
  }
}
