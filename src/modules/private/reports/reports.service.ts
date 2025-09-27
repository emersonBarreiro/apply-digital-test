import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../../common/entities/product.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async getDeletedProductsPercentage() {
    const totalProducts = await this.productRepository.count({
      withDeleted: true,
    });
    const deletedProducts = await this.productRepository.count({
      withDeleted: true,
      where: { deletedAt: (raw) => `${raw} IS NOT NULL` },
    });

    const percentage =
      totalProducts > 0 ? (deletedProducts / totalProducts) * 100 : 0;

    return {
      totalProducts,
      deletedProducts,
      nonDeletedProducts: totalProducts - deletedProducts,
      deletedPercentage: Math.round(percentage * 100) / 100,
      nonDeletedPercentage: Math.round((100 - percentage) * 100) / 100,
    };
  }

  async getNonDeletedProductsReport(startDate?: string, endDate?: string) {
    let queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .where('product.deletedAt IS NULL');

    // Apply date range filter if provided
    if (startDate) {
      queryBuilder = queryBuilder.andWhere('product.createdAt >= :startDate', {
        startDate,
      });
    }

    if (endDate) {
      queryBuilder = queryBuilder.andWhere('product.createdAt <= :endDate', {
        endDate,
      });
    }

    const totalNonDeleted = await queryBuilder.getCount();

    // Count products with price
    const withPriceQuery = queryBuilder
      .clone()
      .andWhere('product.price IS NOT NULL');
    const withPrice = await withPriceQuery.getCount();

    // Count products without price
    const withoutPrice = totalNonDeleted - withPrice;

    const withPricePercentage =
      totalNonDeleted > 0 ? (withPrice / totalNonDeleted) * 100 : 0;
    const withoutPricePercentage =
      totalNonDeleted > 0 ? (withoutPrice / totalNonDeleted) * 100 : 0;

    return {
      totalNonDeletedProducts: totalNonDeleted,
      productsWithPrice: withPrice,
      productsWithoutPrice: withoutPrice,
      withPricePercentage: Math.round(withPricePercentage * 100) / 100,
      withoutPricePercentage: Math.round(withoutPricePercentage * 100) / 100,
      dateRange: {
        startDate: startDate || null,
        endDate: endDate || null,
      },
    };
  }

  async getDataQualityReport() {
    const totalProducts = await this.productRepository.count({
      where: { deletedAt: null },
    });

    // Products missing required fields
    const productsWithoutName = await this.productRepository.count({
      where: { deletedAt: null, name: null },
    });

    const productsWithoutCategory = await this.productRepository.count({
      where: { deletedAt: null, category: null },
    });

    // Products with invalid prices (negative)
    const productsWithInvalidPrice = await this.productRepository
      .createQueryBuilder('product')
      .where('product.deletedAt IS NULL')
      .andWhere('product.price < 0')
      .getCount();

    // Products without description
    const productsWithoutDescription = await this.productRepository.count({
      where: { deletedAt: null, description: null },
    });

    // Calculate quality score
    const qualityIssues =
      productsWithoutName +
      productsWithoutCategory +
      productsWithInvalidPrice +
      productsWithoutDescription;

    const qualityScore =
      totalProducts > 0
        ? Math.max(
            0,
            ((totalProducts * 4 - qualityIssues) / (totalProducts * 4)) * 100,
          )
        : 100;

    return {
      totalProducts,
      dataQualityScore: Math.round(qualityScore * 100) / 100,
      issues: {
        productsWithoutName,
        productsWithoutCategory,
        productsWithInvalidPrice,
        productsWithoutDescription,
      },
      percentages: {
        missingNamePercentage:
          totalProducts > 0
            ? Math.round((productsWithoutName / totalProducts) * 10000) / 100
            : 0,
        missingCategoryPercentage:
          totalProducts > 0
            ? Math.round((productsWithoutCategory / totalProducts) * 10000) /
              100
            : 0,
        invalidPricePercentage:
          totalProducts > 0
            ? Math.round((productsWithInvalidPrice / totalProducts) * 10000) /
              100
            : 0,
        missingDescriptionPercentage:
          totalProducts > 0
            ? Math.round((productsWithoutDescription / totalProducts) * 10000) /
              100
            : 0,
      },
    };
  }

  async getAllReports(startDate?: string, endDate?: string) {
    const [deletedReport, nonDeletedReport, qualityReport] = await Promise.all([
      this.getDeletedProductsPercentage(),
      this.getNonDeletedProductsReport(startDate, endDate),
      this.getDataQualityReport(),
    ]);

    return {
      summary: {
        totalProducts: deletedReport.totalProducts,
        deletedProducts: deletedReport.deletedProducts,
        nonDeletedProducts: deletedReport.nonDeletedProducts,
        qualityScore: qualityReport.dataQualityScore,
      },
      deletionReport: deletedReport,
      pricingReport: nonDeletedReport,
      dataQualityReport: qualityReport,
      generatedAt: new Date().toISOString(),
    };
  }
}
