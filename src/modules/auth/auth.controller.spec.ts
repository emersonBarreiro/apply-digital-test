import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    validateUser: jest.fn(),
    login: jest.fn(),
    generateDemoToken: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);

    // Reset mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return access token for valid credentials', async () => {
      const loginDto = { username: 'admin', password: 'admin123' };
      const mockUser = { userId: 1, username: 'admin', role: 'admin' };
      const mockResult = {
        access_token: 'jwt-token',
        user: { id: 1, username: 'admin', role: 'admin' },
      };

      mockAuthService.validateUser.mockResolvedValue(mockUser);
      mockAuthService.login.mockResolvedValue(mockResult);

      const result = await controller.login(loginDto);

      expect(result).toEqual(mockResult);
      expect(mockAuthService.validateUser).toHaveBeenCalledWith('admin', 'admin123');
      expect(mockAuthService.login).toHaveBeenCalledWith(mockUser);
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      const loginDto = { username: 'admin', password: 'wrongpassword' };

      mockAuthService.validateUser.mockResolvedValue(null);

      await expect(controller.login(loginDto)).rejects.toThrow(UnauthorizedException);
      expect(mockAuthService.login).not.toHaveBeenCalled();
    });
  });

  describe('getDemoToken', () => {
    it('should generate demo token', async () => {
      const mockResult = {
        access_token: 'demo-jwt-token',
        user: { id: 1, username: 'admin', role: 'admin' },
      };

      mockAuthService.generateDemoToken.mockResolvedValue(mockResult);

      const result = await controller.getDemoToken();

      expect(result).toEqual(mockResult);
      expect(mockAuthService.generateDemoToken).toHaveBeenCalled();
    });
  });
});