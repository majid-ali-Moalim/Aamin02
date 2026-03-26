import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { username },
      include: {
        employee: true,
        patient: true,
      },
    });

    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      username: user.username,
      sub: user.id,
      role: user.role,
      employeeType: user.employee?.employeeType,
    };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        employee: user.employee,
        patient: user.patient,
      },
    };
  }

  async createAccessToken(user: any) {
    const payload = {
      username: user.username,
      sub: user.id,
      role: user.role,
      employeeType: user.employee?.employeeType,
    };
    
    return this.jwtService.sign(payload);
  }
}
