import { GRPC_PACKAGE } from '..';

export var GRPC_HEALTH: GRPC_PACKAGE = {
  protoName: 'health',
  packageName: 'grpc.health.v1',
  serviceName: 'Health',
  port: '9999',
};

export interface HealthCheckRequest {
  service: string;
}

export interface HealthCheckResponse {
  status: ServingStatus;
}

export enum ServingStatus {
  UNKNOWN = 0,
  SERVING = 1,
  NOT_SERVING = 2,
}
