import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { AUTH_SERVICE } from "./services";
import { ClientProxy } from "@nestjs/microservices";
import { catchError, Observable, tap } from "rxjs";

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy, // Replace 'any' with the actual type of your auth service
    ) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const authentication = this.getAuthentication(context);
        return this.authClient.send('validate_user', {
            Authentication: authentication
        }).pipe(
            tap((res) => { this.addUser(res, context) }),
            catchError(() => { throw new UnauthorizedException() }),
        )
    }

    private getAuthentication(context: ExecutionContext) {
        let authentication: string | undefined;
        if (context.getType() === 'rpc') {
            authentication = context.switchToRpc().getData().authentication;
        } else if (context.getType() === 'http') {
            authentication = context.switchToHttp().getRequest().headers['authorization'];
        }
        if (!authentication) {
            throw new Error('Authentication header not found');
        }
        return authentication;
    }
    private addUser(user: any, context: ExecutionContext) {
        if (context.getType() === 'rpc') {
            context.switchToRpc().getData().user = user;
        } else if (context.getType() === 'http') {
            context.switchToHttp().getRequest().user = user;
        }
    }
}