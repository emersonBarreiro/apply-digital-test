import { Module } from '@nestjs/common';
import { SyncController } from './sync.controller';
import { SyncService } from './sync.service';
import { ProductsModule } from '../public/products/products.module';

@Module({
  imports: [ProductsModule],
  controllers: [SyncController],
  providers: [SyncService],
})
export class SyncModule {}
