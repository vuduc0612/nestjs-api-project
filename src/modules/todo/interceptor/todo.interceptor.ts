import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Observable, map } from "rxjs";

export class TodoInterceptor implements NestInterceptor{
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any>  {
        return next
        .handle()
        .pipe(map((data) => {
            const result = data.map(({id, ...todo}) => todo);
            return result;
        }))
    }

}