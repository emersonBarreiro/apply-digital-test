import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { SyncService } from './sync.service';
import { ProductsService } from '../public/products/products.service';

describe('SyncService', () => {
  let service: SyncService;
  let productsService: ProductsService;

  const mockProductsService = {
    syncFromContentful: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SyncService,
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<SyncService>(SyncService);
    productsService = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handleHourlySync', () => {
    it('should successfully sync products', async () => {
      const mockResult = {
        created: 5,
        updated: 3,
        errors: 0,
      };

      mockProductsService.syncFromContentful.mockResolvedValue(mockResult);

      const result = await service.handleHourlySync();

      expect(result).toEqual(mockResult);
      expect(mockProductsService.syncFromContentful).toHaveBeenCalled();
    });

    it('should handle sync errors', async () => {
      const error = new Error('Contentful API error');
      mockProductsService.syncFromContentful.mockRejectedValue(error);

      await expect(service.handleHourlySync()).rejects.toThrow('Contentful API error');
    });
  });

  describe('manualSync', () => {
    it('should trigger manual sync', async () => {
      const mockResult = {
        created: 2,
        updated: 1,
        errors: 0,
      };

      mockProductsService.syncFromContentful.mockResolvedValue(mockResult);

      const result = await service.manualSync();

      expect(result).toEqual(mockResult);
      expect(mockProductsService.syncFromContentful).toHaveBeenCalled();
    });
  });
});