import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PrismaClient } from '@prisma/client';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [PrismaService],
  imports: [ConfigModule],
  exports: [PrismaService],
})
export class PrismaModule extends PrismaClient {}
