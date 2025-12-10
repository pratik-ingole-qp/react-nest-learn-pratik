import { Module } from '@nestjs/common'
import { DatabaseModule } from './database/DataBaseModule'

@Module({
  imports: [DatabaseModule],
  exports: [DatabaseModule],
})
export class InfraModule {}