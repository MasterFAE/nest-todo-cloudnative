import { Logger, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SharedModule, SharedService } from '@app/shared';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { PrismaModule } from '@app/prisma';
import { PassportModule } from '@nestjs/passport';
import { MicroService_HealthModule } from '@app/microservice-health';

@Module({
  imports: [
    PrismaModule,
    SharedModule,
    PassportModule,
    MicroService_HealthModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: { expiresIn: configService.get('JWT_EXPIRES_IN') },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, SharedService, JwtStrategy, Logger],
})
export class AuthModule {}
