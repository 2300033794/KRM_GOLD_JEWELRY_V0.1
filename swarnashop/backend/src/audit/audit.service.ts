import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  log(action: string, entity: string, entityId: string, userId = 'system') {
    this.logger.log(
      JSON.stringify({
        action,
        entity,
        entityId,
        userId,
        createdAt: new Date().toISOString(),
      }),
    );
  }
}
