import { Module } from '@nestjs/common';
import { MockBvnHandler } from './mock-bvn.handler';
import { MockNinHandler } from './mock-nin.handler';

@Module({
  providers: [MockBvnHandler, MockNinHandler],
})
export class MockIdentityModule {}
