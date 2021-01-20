import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [
    AuthService,
    JwtStrategy,
  ],
  controllers: [AuthController],
  exports: [JwtStrategy],
})
export class AuthModule { }
