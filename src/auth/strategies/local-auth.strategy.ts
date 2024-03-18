import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'userName', passwordField: 'password' });
  }

  async validate(userName: string, password: string): Promise<User> {
    const user = await this.authService.validateUser(userName, password);

    if (!user) {
      throw new UnauthorizedException('Invalid Credentials');
    }
    return user;
  }
}
