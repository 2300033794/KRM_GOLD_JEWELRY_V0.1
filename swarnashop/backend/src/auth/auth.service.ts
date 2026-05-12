import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import type { StringValue } from 'ms';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, RegisterDto } from './dto';
import { getJwtSecret } from './jwt.config';

function getBcryptRounds() {
  const rounds = Number(process.env.BCRYPT_SALT_ROUNDS ?? 12);

  if (!Number.isInteger(rounds) || rounds < 10) {
    throw new InternalServerErrorException(
      'BCRYPT_SALT_ROUNDS must be an integer >= 10',
    );
  }

  return rounds;
}

function getJwtExpiry(): StringValue {
  const expiry = process.env.JWT_ACCESS_TOKEN_EXPIRES_IN ?? '15m';

  if (!/^\d+[smhd]$/.test(expiry)) {
    throw new InternalServerErrorException(
      'JWT_ACCESS_TOKEN_EXPIRES_IN must match pattern <number><s|m|h|d>',
    );
  }

  return expiry as StringValue;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
      select: { id: true },
    });

    if (existing) {
      throw new ConflictException('Email already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, getBcryptRounds());

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        password: passwordHash,
        role: Role.CUSTOMER,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    return user;
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      select: { id: true, email: true, password: true, role: true },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordValid = await bcrypt.compare(dto.password, user.password);

    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = await this.jwtService.signAsync(
      { sub: user.id, role: user.role },
      {
        secret: getJwtSecret(),
        expiresIn: getJwtExpiry(),
      },
    );

    return { accessToken };
  }
}
