import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { SendEmailDto } from 'src/dto/send-email.dto';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name)

  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(sendEmailDto: SendEmailDto): Promise<void> {
    this.logger.log(`Enviando e-mail para ${sendEmailDto.to}`)

    const { to, subject,content } = sendEmailDto

    await this.mailerService.sendMail({
      to,
      subject,
      html: content,
      text: content,
    })

    this.logger.log('E-mail enviado com sucesso!')
  }
}
