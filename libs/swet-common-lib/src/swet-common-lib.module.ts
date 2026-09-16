import { Module } from '@nestjs/common';
import { SwetCommonLibService } from './swet-common-lib.service';

@Module({
  providers: [SwetCommonLibService],
  exports: [SwetCommonLibService],
})
export class SwetCommonLibModule {}
