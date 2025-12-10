import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { databaseProviders } from './providers/DatabaseProvider';

@Module({
  imports: [ConfigModule],       
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
