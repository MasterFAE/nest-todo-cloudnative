import { RmqOptions } from '@nestjs/microservices';

export default interface ISharedService {
  getRmqOptions(queue: string): RmqOptions;
  acknowledgeMessage(context: any): void;
}
