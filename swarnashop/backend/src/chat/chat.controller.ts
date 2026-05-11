import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { StoreService } from '../store/store.service';

@Controller('api/chat')
export class ChatController {
  constructor(private readonly store: StoreService) {}

  @Post('session')
  session(@Body() body: { userId?: string; guestId?: string }) {
    const existing =
      this.store.chatSessions.find(
        (s) => s.userId === body.userId && body.userId,
      ) ||
      this.store.chatSessions.find(
        (s) => s.guestId === body.guestId && body.guestId,
      );
    if (existing) return existing;
    const session = {
      id: crypto.randomUUID(),
      userId: body.userId,
      guestId: body.guestId,
      messages: [],
    };
    this.store.chatSessions.push(session);
    return session;
  }

  @Post('message')
  message(@Body() body: { sessionId: string; content: string }) {
    const session = this.store.chatSessions.find(
      (s) => s.id === body.sessionId,
    );
    if (!session) return { message: 'Invalid session' };
    const userMsg = {
      id: crypto.randomUUID(),
      role: 'user',
      content: body.content,
      createdAt: new Date().toISOString(),
    };
    const rate =
      this.store.goldRates.find((r) => r.purity === '22KT')?.ratePerGram ?? 0;
    const assistant = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: `Today's 22KT rate is ₹${rate}/g. We can help with products, tracking, and price estimates.`,
      createdAt: new Date().toISOString(),
    };
    session.messages.push(userMsg, assistant);
    return assistant;
  }

  @Get('history/:sessionId')
  history(@Param('sessionId') sessionId: string) {
    return (
      this.store.chatSessions.find((s) => s.id === sessionId)?.messages ?? []
    );
  }
}
