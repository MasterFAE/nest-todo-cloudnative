import { Logger, Module } from '@nestjs/common';
import { ExampleController } from './example.controller';
import { ExampleService } from './example.service';
// import { PrismaModule } from '@app/prisma';
import { SharedModule, SharedService } from '@app/shared';

@Module({
  imports: [
    // PrismaModule,
    SharedModule,
  ],
  controllers: [ExampleController],
  providers: [ExampleService, SharedService, Logger],
})
export class ExampleModule {}
