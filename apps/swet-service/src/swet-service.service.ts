import { Injectable } from '@nestjs/common';

@Injectable()
export class SwetServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
