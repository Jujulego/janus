import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { GraphQLSchemaHost } from '@nestjs/graphql';
import { Observable } from 'rxjs';

// Interceptor
@Injectable()
export class GraphQLInterceptor implements NestInterceptor {
  // Constructor
  constructor(private readonly _schema: GraphQLSchemaHost) {}

  // Methods
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Add request data
    const req = context.switchToHttp().getRequest();

    if (req) {
      req.schema = this._schema.schema;
    }

    return next.handle();
  }
}
