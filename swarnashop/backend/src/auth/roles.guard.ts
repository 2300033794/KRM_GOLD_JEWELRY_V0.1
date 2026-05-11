import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles) return true;
    const req = context
      .switchToHttp()
      .getRequest<{ user?: { role?: string } }>();
    const userRole = req.user?.role ?? 'CUSTOMER';
    return roles.includes(userRole);
  }
}
