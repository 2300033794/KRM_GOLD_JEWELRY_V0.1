import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import { RequestUser } from './auth.types';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<{
      headers: { authorization?: string };
      user?: RequestUser;
    }>();

    const [scheme, token] = (req.headers.authorization ?? '').split(' ');

    if (scheme !== 'Bearer') {
      throw new UnauthorizedException('Missing bearer token');
    }

    if (!token) throw new UnauthorizedException('Missing token');
    const secret = process.env.JWT_SECRET ?? 'your_jwt_secret';

    try {
      const payload = this.jwtService.verify<{ sub: string; role: Role }>(
        token,
        { secret },
      );
      req.user = { id: payload.sub, role: payload.role };
      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
