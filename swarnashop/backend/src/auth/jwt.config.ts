import { InternalServerErrorException } from '@nestjs/common';

export function getJwtSecret(): string {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new InternalServerErrorException('JWT_SECRET is not configured');
  }

  return jwtSecret;
}
