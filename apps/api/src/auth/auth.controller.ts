import {
  Body,
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Post,
  Res,
} from '@nestjs/common';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { GRPC_AUTH, IAuthServiceClient } from '@app/shared/types/service/auth';
import { CreateUserDto, LoginDto } from './dto';
import { Public } from '../lib/decorators/public.decorator';
import { User } from '../lib/decorators/user.decorator';
import setCookieOptions from '../lib/setCookieOptions';

@Controller('auth')
export class AuthController implements OnModuleInit {
  private authServer: IAuthServiceClient;

  constructor(@Inject(GRPC_AUTH.serviceName) private client: ClientGrpc) {}

  onModuleInit() {
    this.authServer = this.client.getService<IAuthServiceClient>(
      GRPC_AUTH.serviceName,
    );
  }

  @Public()
  @Get('test')
  pri() {
    return 'sa';
  }

  @Get('current-user')
  printTest(@User() user) {
    return user;
  }

  @Get('')
  async getCurrentUser(@User('sub') id) {
    try {
      const serviceResponse = await firstValueFrom(
        this.authServer.currentUser({ id }),
      );

      return serviceResponse;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Public()
  @Post('login')
  async login(@Res() res, @Body() data: LoginDto) {
    try {
      const serviceResponse = await firstValueFrom(this.authServer.login(data));
      setCookieOptions(res, 'access_token', serviceResponse.token);
      res.json(serviceResponse);
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Public()
  @Post('register')
  async register(@Res() res, @Body() data: CreateUserDto) {
    try {
      const serviceResponse = await firstValueFrom(
        this.authServer.register(data),
      );
      setCookieOptions(res, 'access_token', serviceResponse.token);
      res.json(serviceResponse);
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
