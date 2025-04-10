/* eslint-disable @typescript-eslint/no-unsafe-return */
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UsersDocument } from '../models';

const getCurrentUserByContext = (context: ExecutionContext): UsersDocument => {
  return context.switchToHttp()?.getRequest<{ user: UsersDocument }>().user;
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    getCurrentUserByContext(context),
);
