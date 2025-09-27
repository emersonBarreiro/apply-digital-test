import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReportsService } from './reports.service';
import { Product } from '../../../common/entities/product.entity';

describe('ReportsService', () => {
  let service: ReportsService;
  let repository: Repository<Product>;

  const mockQueryBuilder = {
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    clone: jest.fn().mockReturnThis(),
    getCount: jest.fn(),
  };

  const mockRepository = {
    count: jest.fn(),
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
    repository = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getDeletedProductsPercentage', () => {
    it('should calculate deletion percentages correctly', async () => {
      mockRepository.count
        .mockResolvedValueOnce(100) // total products
        .mockResolvedValueOnce(25); // deleted products

      const result = await service.getDeletedProductsPercentage();

      expect(result).toEqual({
        totalProducts: 100,
        deletedProducts: 25,
        nonDeletedProducts: 75,
        deletedPercentage: 25,
        nonDeletedPercentage: 75,
      });
    });

    it('should handle zero products', async () => {
      mockRepository.count
        .mockResolvedValueOnce(0) // total products
        .mockResolvedValueOnce(0); // deleted products

      const result = await service.getDeletedProductsPercentage();

      expect(result.deletedPercentage).toBe(0);
      expect(result.nonDeletedPercentage).toBe(100);
    });
  });

  describe('getDataQualityReport', () => {
    it('should generate quality report', async () => {
      mockRepository.count
        .mockResolvedValueOnce(100) // total products
        .mockResolvedValueOnce(5) // without name
        .mockResolvedValueOnce(10) // without category
        .mockResolvedValueOnce(15); // without description

      mockQueryBuilder.getCount.mockResolvedValue(2); // invalid price

      const result = await service.getDataQualityReport();

      expect(result.totalProducts).toBe(100);
      expect(result.issues.productsWithoutName).toBe(5);
      expect(result.issues.productsWithoutCategory).toBe(10);
      expect(result.issues.productsWithInvalidPrice).toBe(2);
      expect(result.issues.productsWithoutDescription).toBe(15);
      expect(result.dataQualityScore).toBeGreaterThan(0);
    });
  });
});
