import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ICompany } from './company.types';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): ICompany => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
