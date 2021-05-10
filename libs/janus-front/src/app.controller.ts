import { Controller, Get } from '@nestjs/common';

// Controller
@Controller()
export class AppController {
  // Endpoints
  @Get('/front')
  front() {
    return 'Hello world !';
  }
}
