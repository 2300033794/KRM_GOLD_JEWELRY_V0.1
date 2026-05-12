import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { PrismaService } from '../prisma/prisma.service';
import { ChatMessageDto, ChatSessionDto } from './dto';

function getOpenAiClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new InternalServerErrorException('OPENAI_API_KEY is missing');
  }
  return new OpenAI({ apiKey });
}

@Injectable()
export class ChatService {
  private readonly openai = getOpenAiClient();

  constructor(private readonly prisma: PrismaService) {}

  async getOrCreateSession(dto: ChatSessionDto, userId?: string) {
    const resolvedUserId = userId ?? dto.userId;
    const guestId = dto.guestId;

    if (!resolvedUserId && !guestId) {
      throw new BadRequestException('userId or guestId is required');
    }

    const existing = await this.prisma.chatSession.findFirst({
      where: resolvedUserId ? { userId: resolvedUserId } : { guestId },
      include: { messages: true },
    });

    if (existing) {
      return existing;
    }

    return this.prisma.chatSession.create({
      data: {
        userId: resolvedUserId,
        guestId,
      },
      include: { messages: true },
    });
  }

  async sendMessage(dto: ChatMessageDto, userId?: string) {
    const session = await this.prisma.chatSession.findUnique({
      where: { id: dto.sessionId },
    });

    if (!session) {
      throw new NotFoundException('Chat session not found');
    }

    const [rate24kt, rate22kt, rate18kt] = await this.prisma.$transaction([
      this.prisma.goldRate.findFirst({
        where: { purity: '24KT' },
        orderBy: { effectiveDate: 'desc' },
      }),
      this.prisma.goldRate.findFirst({
        where: { purity: '22KT' },
        orderBy: { effectiveDate: 'desc' },
      }),
      this.prisma.goldRate.findFirst({
        where: { purity: '18KT' },
        orderBy: { effectiveDate: 'desc' },
      }),
    ]);

    const systemPrompt = [
      'You are SwarnaShop’s virtual jewelry assistant.',
      'Use the latest gold rates when explaining pricing or estimates.',
      `Latest rates: 24KT ₹${rate24kt?.ratePerGram ?? 'N/A'}/g, 22KT ₹${rate22kt?.ratePerGram ?? 'N/A'}/g, 18KT ₹${rate18kt?.ratePerGram ?? 'N/A'}/g.`,
    ].join(' ');

    const history = await this.prisma.chatMessage.findMany({
      where: { sessionId: dto.sessionId },
      orderBy: { createdAt: 'asc' },
    });

    const historyMessages = history.map(
      (message): ChatCompletionMessageParam => ({
        role: message.role === 'assistant' ? 'assistant' : 'user',
        content: message.content,
      }),
    );

    const messages: ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...historyMessages,
      { role: 'user', content: dto.content },
    ];

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
    });

    const assistantContent = completion.choices[0]?.message?.content?.trim();

    if (!assistantContent) {
      throw new InternalServerErrorException('OpenAI response was empty');
    }

    const [, assistantMessage] = await this.prisma.$transaction([
      this.prisma.chatMessage.create({
        data: {
          sessionId: dto.sessionId,
          role: 'user',
          content: dto.content,
          createdById: userId,
        },
      }),
      this.prisma.chatMessage.create({
        data: {
          sessionId: dto.sessionId,
          role: 'assistant',
          content: assistantContent,
        },
      }),
      this.prisma.chatSession.update({
        where: { id: dto.sessionId },
        data: { updatedAt: new Date() },
      }),
    ]);

    return assistantMessage;
  }

  async history(sessionId: string) {
    return this.prisma.chatMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
    });
  }
}
