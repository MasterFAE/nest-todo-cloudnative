import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);
  constructor(private configService: ConfigService) {
    super({
      datasources: {
        db: {
          url: configService.get('DATABASE_URL'),
        },
      },
    });
  }
  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.debug('[DATABASE]: Connected');
    } catch (error) {
      this.logger.error('[DATABASE]: Connection error');
      throw new Error(`${error}`);
    }
  }

  // async enableShutdownHooks(app: INestApplication) {
  //   this.$on('beforeExit', async () => {
  //     this.logger.log('[DATABASE]: Disconnected');
  //     await app.close();
  //   });
  // }
}
