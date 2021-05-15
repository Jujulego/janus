import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

import { DataService } from '@jujulego/janus-common';

// Types
declare global {
  namespace Express {
    interface Request {
      janusData?: DataService;
    }
  }
}

// Interceptor
@Injectable()
export class AppInterceptor implements NestInterceptor {
  // Constructor
  constructor(
    private readonly data: DataService
  ) {}

  // Methods
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Add request data
    const req = context.switchToHttp().getRequest<Request>();
    req.janusData = this.data;

    return next.handle();
  }
}
