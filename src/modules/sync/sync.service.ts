import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { ProductsService } from '../public/products/products.service';

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);

  constructor(
    private readonly productsService: ProductsService,
    private readonly configService: ConfigService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleHourlySync() {
    this.logger.log('Starting hourly Contentful sync...');

    try {
      const result = await this.productsService.syncFromContentful();

      this.logger.log(
        `Hourly sync completed successfully. ` +
        `Created: ${result.created}, Updated: ${result.updated}, Errors: ${result.errors}`
      );

      return result;
    } catch (error) {
      this.logger.error(`Hourly sync failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  // Manual sync endpoint for debugging/testing
  async manualSync() {
    this.logger.log('Manual sync triggered...');
    return this.handleHourlySync();
  }
}