import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  // Simple demo auth - in real app this would validate against database
  async validateUser(username: string, password: string): Promise<any> {
    // Hard-coded admin credentials for demo purposes
    if (username === 'admin' && password === 'admin123') {
      return {
        userId: 1,
        username: 'admin',
        role: 'admin',
      };
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      username: user.username,
      sub: user.userId,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.userId,
        username: user.username,
        role: user.role,
      },
    };
  }

  // Generate a demo token for testing
  async generateDemoToken() {
    const demoUser = {
      userId: 1,
      username: 'admin',
      role: 'admin',
    };

    return this.login(demoUser);
  }
}
