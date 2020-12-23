import { Controller, Get } from '@nestjs/common';

@Controller('api/v1/players')
export class PlayersController {
  @Get()
  sendHello(): { message: string } {
    return { message: 'PlayersController' }
  }
}
