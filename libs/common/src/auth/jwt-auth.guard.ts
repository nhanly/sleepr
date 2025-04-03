import { CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { map, Observable, tap } from 'rxjs';
import { AUTH_SERVICE } from '../constants/services';
import { ClientProxy } from '@nestjs/microservices';

export class JwtAuthGuard implements CanActivate {
  constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const jwt = context
      .switchToHttp()
      .getRequest<{ cookies: { Authentication: string } }>()
      .cookies?.Authentication;
    if (!jwt) {
      return false;
    }

    return this.authClient
      .send('authenticate', {
        Authentication: jwt,
      })
      .pipe(
        // eslint-disable-next-line prettier/prettier
        tap(res => {
          context.switchToHttp().getRequest<{ user: unknown }>().user = res;
        }),
        map(() => true),
      );
  }
}
