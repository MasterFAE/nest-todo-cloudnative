import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  RmqOptions,
  Transport,
  RmqContext,
  GrpcOptions,
} from '@nestjs/microservices';
import ISharedService from './interface/ISharedService';
import { join } from 'path';
import { GRPC_PACKAGE } from './types';

@Injectable()
export class SharedService implements ISharedService {
  constructor(private readonly configService: ConfigService) {}
  getRmqOptions(queue: string): RmqOptions {
    const USER = this.configService.get('RABBITMQ_USER');
    const PASSWORD = this.configService.get('RABBITMQ_PASS');
    const HOST = this.configService.get('RABBITMQ_HOST');

    return {
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${USER}:${PASSWORD}@${HOST}`],
        noAck: false,
        queue,
        queueOptions: {
          durable: true,
        },
      },
    };
  }
  /**
   * Sets up gRPC server connection
   */
  getGrpcOptions({ packageName, protoName, port }: GRPC_PACKAGE): GrpcOptions {
    return {
      transport: Transport.GRPC,
      options: {
        package: packageName,
        protoPath: join(__dirname, `../${protoName}.proto`),
        url: `localhost:${port}`,
        // url: env != 'local' ? `${name}:50051` : 'localhost:5000',
      },
    };
  }

  acknowledgeMessage(context: RmqContext) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);
  }
}
