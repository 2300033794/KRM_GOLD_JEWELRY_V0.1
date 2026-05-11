import {
  Body,
  Controller,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import type { Response } from 'express';
import { StoreService } from '../store/store.service';
import { LoginDto, RegisterDto } from './dto';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly store: StoreService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const exists = this.store.users.find((u) => u.email === dto.email);
    if (exists) throw new UnauthorizedException('Email already exists');
    const hash = await bcrypt.hash(dto.password, 12);
    const user = {
      id: crypto.randomUUID(),
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      password: hash,
      role: 'CUSTOMER' as const,
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    this.store.users.push(user);
    return { id: user.id, name: user.name, email: user.email };
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = this.store.users.find((u) => u.email === dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(dto.password, user.password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    const accessToken = this.jwtService.sign(
      { sub: user.id, role: user.role },
      { expiresIn: '15m', secret: process.env.JWT_SECRET ?? 'your_jwt_secret' },
    );
    const refreshToken = this.jwtService.sign(
      { sub: user.id, role: user.role },
      {
        expiresIn: '7d',
        secret: process.env.JWT_REFRESH_SECRET ?? 'your_refresh_secret',
      },
    );
    res.cookie('accessToken', accessToken, { httpOnly: true, sameSite: 'lax' });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
    });
    return {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  @Post('refresh')
  refresh(@Res({ passthrough: true }) res: Response) {
    const accessToken = this.jwtService.sign(
      { sub: 'guest', role: 'CUSTOMER' },
      { expiresIn: '15m', secret: process.env.JWT_SECRET ?? 'your_jwt_secret' },
    );
    res.cookie('accessToken', accessToken, { httpOnly: true, sameSite: 'lax' });
    return { accessToken };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return { message: 'Logged out' };
  }
}
