import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { UserPayload } from '../interfaces/user-payload.interface';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): UserPayload | undefined => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.user as UserPayload | undefined;
  },
);
