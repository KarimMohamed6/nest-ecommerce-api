import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isArray } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { UsersService } from 'src/users/users.service';
import { User as user } from 'src/users/entities/user.entity';

declare global {
  namespace Express {
    interface Request {
      currentUser?: user;
    }
  }
}
@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const authheader = req.headers.authorization || req.headers.Authorization;

    if (
      !authheader ||
      isArray(authheader) ||
      !authheader.startsWith('Bearer ')
    ) {
      req.currentUser = null;
      next();
      return;
    } else {
      try {
        const token = authheader.split(' ')[1];
        const { id } = <jwtPayload>(
          verify(token, this.configService.get('JWT_SECRET'))
        );
        const currentUser = await this.userService.findOneById(+id);
        req.currentUser = currentUser;
        // console.log(currentUser);
        next();
      } catch (error) {
        req.currentUser = null;
        next();
      }
    }
  }
}
interface jwtPayload {
  id: string;
}
