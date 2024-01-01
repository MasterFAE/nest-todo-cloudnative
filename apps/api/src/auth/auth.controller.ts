import { Public } from '@app/shared/decorators/public.decorator';
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
import setCookieOptions from '@app/shared/helper/functions/setCookieOptions';
import { User } from '@app/shared/decorators/user.decorator';
import { GRPC_AUTH, IAuthServiceClient } from '@app/shared/types/service/auth';
import { CreateUserDto, LoginDto } from './dto';

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
  @Get('test2')
  pri() {
    return 'sa';
  }

  @Get('test')
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
