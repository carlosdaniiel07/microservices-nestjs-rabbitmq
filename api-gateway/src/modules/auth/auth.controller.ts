import { Body, Controller, Logger, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Controller('api/v1/auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name)

  constructor(private service: AuthService) {}

  @Post('sign-up')
  @UsePipes(ValidationPipe)
  async signUp(@Body() signUpDto: SignUpDto): Promise<any> {
    return await this.service.signUp(signUpDto)
  }

  @Post('sign-in')
  @UsePipes(ValidationPipe)
  async signIn(@Body() signInDto: SignInDto): Promise<{ accessToken: string }> {
    const accessToken = await this.service.signIn(signInDto)
    return { accessToken }
  }
}
