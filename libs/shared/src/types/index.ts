export type GRPC_PACKAGE = {
  protoName: string;
  packageName: string;
  serviceName: string;
  host?: string;
  port?: string | number;
  httpPort?: string | number;
};
