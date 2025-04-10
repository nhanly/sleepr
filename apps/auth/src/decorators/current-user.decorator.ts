/* eslint-disable @typescript-eslint/no-unsafe-return */
import { UsersDocument } from '@app/common';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

const getCurrentUserByContext = (context: ExecutionContext): UsersDocument => {
  return context.switchToHttp()?.getRequest<{ user: UsersDocument }>().user;
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    getCurrentUserByContext(context),
);
