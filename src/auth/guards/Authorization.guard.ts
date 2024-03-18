import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, find } from 'rxjs';
import { ALLOWED_ROLES } from 'src/utility/decorators/authorize-roles.decorator';

@Injectable()
export class AuthorizeGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>(
      ALLOWED_ROLES,
      context.getHandler(),
    );
    const request = context.switchToHttp().getRequest();
    const result = request?.currentUser?.roles
      .map((role: string) => roles.includes(role))
      .find((value: boolean) => value == true);
    if (result) return true;
    throw new UnauthorizedException('User not authorized');
  }
}
