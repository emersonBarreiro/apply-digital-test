import { Test, TestingModule } from '@nestjs/testing';
import { SyncController } from './sync.controller';
import { SyncService } from './sync.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

describe('SyncController', () => {
  let controller: SyncController;
  let service: SyncService;

  const mockSyncService = {
    manualSync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SyncController],
      providers: [
        {
          provide: SyncService,
          useValue: mockSyncService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<SyncController>(SyncController);
    service = module.get<SyncService>(SyncService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('triggerManualSync', () => {
    it('should trigger manual sync and return results', async () => {
      const mockResult = {
        created: 10,
        updated: 5,
        errors: 1,
      };

      mockSyncService.manualSync.mockResolvedValue(mockResult);

      const result = await controller.triggerManualSync();

      expect(result).toEqual(mockResult);
      expect(mockSyncService.manualSync).toHaveBeenCalled();
    });

    it('should handle sync errors', async () => {
      const error = new Error('Sync failed');
      mockSyncService.manualSync.mockRejectedValue(error);

      await expect(controller.triggerManualSync()).rejects.toThrow('Sync failed');
    });
  });
});