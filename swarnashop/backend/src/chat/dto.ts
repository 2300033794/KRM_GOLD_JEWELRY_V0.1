import { IsOptional, IsString } from 'class-validator';

export class ChatSessionDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  guestId?: string;
}

export class ChatMessageDto {
  @IsString()
  sessionId!: string;

  @IsString()
  content!: string;
}
