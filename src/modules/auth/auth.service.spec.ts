import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user for valid credentials', async () => {
      const result = await service.validateUser('admin', 'admin123');

      expect(result).toEqual({
        userId: 1,
        username: 'admin',
        role: 'admin',
      });
    });

    it('should return null for invalid credentials', async () => {
      const result = await service.validateUser('admin', 'wrongpassword');

      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access token and user info', async () => {
      const mockUser = { userId: 1, username: 'admin', role: 'admin' };
      const mockToken = 'mock-jwt-token';

      mockJwtService.sign.mockReturnValue(mockToken);

      const result = await service.login(mockUser);

      expect(result).toEqual({
        access_token: mockToken,
        user: {
          id: 1,
          username: 'admin',
          role: 'admin',
        },
      });

      expect(mockJwtService.sign).toHaveBeenCalledWith({
        username: 'admin',
        sub: 1,
        role: 'admin',
      });
    });
  });
});
