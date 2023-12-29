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

  getGrpcOptions(name: string, protoName: string): GrpcOptions {
    return {
      transport: Transport.GRPC,
      options: {
        package: name,
        protoPath: join(__dirname, `../${protoName}.proto`),
        url: `${name}:50051`,
      },
    };
  }

  acknowledgeMessage(context: RmqContext) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);
  }
}
