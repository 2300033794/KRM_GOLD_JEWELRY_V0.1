import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Role } from '@prisma/client';
import { Reflector } from '@nestjs/core';
import { RequestUser } from './auth.types';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles) return true;

    const req = context
      .switchToHttp()
      .getRequest<{ user?: RequestUser }>();

    if (!req.user) {
      throw new UnauthorizedException('Authentication required');
    }

    if (!roles.includes(req.user.role)) {
      throw new ForbiddenException('Insufficient role');
    }

    return true;
  }
}
