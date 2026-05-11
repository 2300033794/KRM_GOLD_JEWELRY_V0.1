import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<{
      headers: { authorization?: string };
      cookies?: Record<string, string>;
      user?: { id: string; role: string };
    }>();
    const bearer = req.headers.authorization?.replace('Bearer ', '');
    const token = bearer || req.cookies?.accessToken;
    if (!token) throw new UnauthorizedException('Missing token');
    const secret = process.env.JWT_SECRET ?? 'your_jwt_secret';
    try {
      const payload = this.jwtService.verify<{ sub: string; role: string }>(
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
