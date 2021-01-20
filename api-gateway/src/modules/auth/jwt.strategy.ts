import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt'
import { passportJwtSecret } from 'jwks-rsa'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name)

  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      issuer: configService.get<string>('AWS_COGNITO_AUTHORITY'),
      client_id: configService.get<string>('AWS_COGNITO_CLIENT_ID'),
      algorithms: ['RS256'],
      secretOrKeyProvider: passportJwtSecret({
        jwksUri: `${configService.get<string>('AWS_COGNITO_AUTHORITY')}/.well-known/jwks.json`,
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 3,
      }),
    })
  }

  public validate(payload: any): any {
    this.logger.log(payload)

    return { userId: payload.sub }
  }
}