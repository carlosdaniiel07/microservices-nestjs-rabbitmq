import { Controller, Logger } from '@nestjs/common';
import { RankingService } from './services/ranking.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name)

  constructor(
    private readonly service: RankingService
  ) {}
}
