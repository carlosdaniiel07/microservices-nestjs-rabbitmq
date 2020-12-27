import { ArgumentsHost, Catch, ExceptionFilter, Logger } from "@nestjs/common";
import { RmqContext, RpcException } from "@nestjs/microservices";

@Catch(RpcException)
export class RpcExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(RpcExceptionFilter.name)

  async catch(exception: any, host: ArgumentsHost) {    
    const ctx = host.switchToRpc().getContext<RmqContext>()
    const channel = ctx.getChannelRef()
    const message = ctx.getMessage()

    await channel.ack(message)
  }
}