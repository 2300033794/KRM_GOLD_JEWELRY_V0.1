import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import type { RequestUser } from '../auth/auth.types';
import { ChatService } from './chat.service';
import { ChatMessageDto, ChatSessionDto } from './dto';

@Controller('api/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('session')
  session(@Body() body: ChatSessionDto, @Req() req: { user?: RequestUser }) {
    return this.chatService.getOrCreateSession(body, req.user?.id);
  }

  @Post('message')
  message(@Body() body: ChatMessageDto, @Req() req: { user?: RequestUser }) {
    return this.chatService.sendMessage(body, req.user?.id);
  }

  @Get('history/:sessionId')
  history(@Param('sessionId') sessionId: string) {
    return this.chatService.history(sessionId);
  }
}
