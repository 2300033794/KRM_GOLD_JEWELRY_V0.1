import { Body, Controller, Get, Param, Patch, Put, Req } from '@nestjs/common';
import { IsBoolean } from 'class-validator';
import { StoreService } from '../store/store.service';

class UserStatusDto {
  @IsBoolean()
  isActive!: boolean;
}

@Controller('api/users')
export class UsersController {
  constructor(private readonly store: StoreService) {}

  @Get()
  list() {
    return this.store.users.map((u) => ({ ...u, password: undefined }));
  }

  @Get('me')
  me(@Req() req: { user?: { id?: string } }) {
    return this.store.users.find((u) => u.id === req.user?.id) ?? null;
  }

  @Put('me')
  updateMe(
    @Req() req: { user?: { id?: string } },
    @Body() body: { name?: string; phone?: string },
  ) {
    const user = this.store.users.find((u) => u.id === req.user?.id);
    if (!user) return { message: 'Not found' };
    Object.assign(user, body);
    return { ...user, password: undefined };
  }

  @Get(':id')
  byId(@Param('id') id: string) {
    const user = this.store.users.find((u) => u.id === id);
    return user ? { ...user, password: undefined } : { message: 'Not found' };
  }

  @Patch(':id/status')
  status(@Param('id') id: string, @Body() body: UserStatusDto) {
    const user = this.store.users.find((u) => u.id === id);
    if (!user) return { message: 'Not found' };
    user.isActive = body.isActive;
    return { ...user, password: undefined };
  }
}
