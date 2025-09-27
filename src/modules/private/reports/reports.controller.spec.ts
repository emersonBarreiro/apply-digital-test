import { Test, TestingModule } from '@nestjs/testing';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';

describe('ReportsController', () => {
  let controller: ReportsController;
  let service: ReportsService;

  const mockReportsService = {
    getDeletedProductsPercentage: jest.fn(),
    getNonDeletedProductsReport: jest.fn(),
    getDataQualityReport: jest.fn(),
    getAllReports: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportsController],
      providers: [
        {
          provide: ReportsService,
          useValue: mockReportsService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ReportsController>(ReportsController);
    service = module.get<ReportsService>(ReportsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getDeletionReport', () => {
    it('should return deletion statistics', async () => {
      const mockResult = {
        totalProducts: 100,
        deletedProducts: 25,
        nonDeletedProducts: 75,
        deletedPercentage: 25,
        nonDeletedPercentage: 75,
      };

      mockReportsService.getDeletedProductsPercentage.mockResolvedValue(mockResult);

      const result = await controller.getDeletionReport();

      expect(result).toEqual(mockResult);
      expect(mockReportsService.getDeletedProductsPercentage).toHaveBeenCalled();
    });
  });

  describe('getPricingAnalysis', () => {
    it('should return pricing analysis with date range', async () => {
      const dateRange = {
        startDate: '2024-01-01',
        endDate: '2024-12-31',
      };

      const mockResult = {
        totalNonDeletedProducts: 75,
        productsWithPrice: 60,
        productsWithoutPrice: 15,
        withPricePercentage: 80,
        withoutPricePercentage: 20,
        dateRange,
      };

      mockReportsService.getNonDeletedProductsReport.mockResolvedValue(mockResult);

      const result = await controller.getPricingAnalysis(dateRange);

      expect(result).toEqual(mockResult);
      expect(mockReportsService.getNonDeletedProductsReport).toHaveBeenCalledWith(
        '2024-01-01',
        '2024-12-31'
      );
    });

    it('should work without date range', async () => {
      const mockResult = {
        totalNonDeletedProducts: 75,
        productsWithPrice: 60,
        productsWithoutPrice: 15,
        withPricePercentage: 80,
        withoutPricePercentage: 20,
        dateRange: { startDate: null, endDate: null },
      };

      mockReportsService.getNonDeletedProductsReport.mockResolvedValue(mockResult);

      const result = await controller.getPricingAnalysis({});

      expect(result).toEqual(mockResult);
      expect(mockReportsService.getNonDeletedProductsReport).toHaveBeenCalledWith(
        undefined,
        undefined
      );
    });
  });

  describe('getDataQualityReport', () => {
    it('should return data quality metrics', async () => {
      const mockResult = {
        totalProducts: 100,
        dataQualityScore: 85.5,
        issues: {
          productsWithoutName: 5,
          productsWithoutCategory: 10,
          productsWithInvalidPrice: 2,
          productsWithoutDescription: 15,
        },
        percentages: {
          missingNamePercentage: 5,
          missingCategoryPercentage: 10,
          invalidPricePercentage: 2,
          missingDescriptionPercentage: 15,
        },
      };

      mockReportsService.getDataQualityReport.mockResolvedValue(mockResult);

      const result = await controller.getDataQualityReport();

      expect(result).toEqual(mockResult);
      expect(mockReportsService.getDataQualityReport).toHaveBeenCalled();
    });
  });

  describe('getAllReports', () => {
    it('should return comprehensive report', async () => {
      const dateRange = {
        startDate: '2024-01-01',
        endDate: '2024-12-31',
      };

      const mockResult = {
        summary: {
          totalProducts: 100,
          deletedProducts: 25,
          nonDeletedProducts: 75,
          qualityScore: 85.5,
        },
        deletionReport: {},
        pricingReport: {},
        dataQualityReport: {},
        generatedAt: '2024-01-01T00:00:00.000Z',
      };

      mockReportsService.getAllReports.mockResolvedValue(mockResult);

      const result = await controller.getAllReports(dateRange);

      expect(result).toEqual(mockResult);
      expect(mockReportsService.getAllReports).toHaveBeenCalledWith(
        '2024-01-01',
        '2024-12-31'
      );
    });
  });
});