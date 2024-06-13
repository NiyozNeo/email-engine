import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): IUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.session.user;
  },
);


import 'express-session';
import { IUser } from '../interface/user.interface';

declare module 'express-session' {
  interface SessionData {
    accessToken: string;
    user: {
      id: string;
      email: string;
      displayName: string;
      accessToken: string;
    };
  }
}
