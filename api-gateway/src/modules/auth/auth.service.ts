import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CognitoUserPool, CognitoUserAttribute, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js'
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';


@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)
  private readonly userPool: CognitoUserPool = null

  constructor(private readonly configService: ConfigService) {
    this.userPool = new CognitoUserPool({
      UserPoolId: this.configService.get<string>('AWS_COGNITO_USER_POOL_ID'),
      ClientId: this.configService.get<string>('AWS_COGNITO_CLIENT_ID'),
    })
  }
  
  async signUp(signUpDto: SignUpDto): Promise<CognitoUser | Error> {
    const { email, name, phoneNumber, password } = signUpDto
    const attributes: CognitoUserAttribute[] = [
      new CognitoUserAttribute({
        Name: 'email',
        Value: email,
      }),
      new CognitoUserAttribute({
        Name: 'name',
        Value: name,
      }),
      new CognitoUserAttribute({
        Name: 'phone_number',
        Value: phoneNumber,
      }),
    ]

    return new Promise<CognitoUser | Error>((resolve, reject) => {
      this.userPool.signUp(email, password, attributes, null, (err, result) => {
        if (err) {
          this.logger.error(err)
          return reject(err)
        }
  
        this.logger.log('Usuário criado com sucesso no Amazon Cognito!')

        resolve(result.user)
      })
    })
  }

  async signIn(signInDto: SignInDto): Promise<string> {
    const { email, password } = signInDto
    
    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    })

    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: this.userPool,
    })

    return new Promise<string>((resolve, reject) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: response => resolve(response.getAccessToken().getJwtToken()),
        onFailure: response => reject(response),
      })
    })
  }
}
