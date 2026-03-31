import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  private log(message: string) {
    const logPath = path.join(process.cwd(), 'auth.log');
    const timestamp = new Date().toISOString();
    fs.appendFileSync(logPath, `[${timestamp}] ${message}\n`);
    console.log(message);
  }

  async validateUser(username: string, password: string): Promise<any> {
    this.log(`[AuthService] Validating user: "${username}"`);
    
    if (!username) {
      this.log(`[AuthService] Username is empty!`);
      return null;
    }

    // Hardcoded Admin Fallback
    if (username === 'aamin@admin' && password === '123321@admin') {
      this.log(`[AuthService] Hardcoded admin login successful`);
      return {
        id: 'hardcoded-admin-uuid',
        username: 'aamin@admin',
        email: 'aamin@admin',
        role: Role.ADMIN,
        employee: null,
        patient: null
      };
    }

    // Search by username OR email
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { username: username },
          { email: username }
        ]
      },
      include: {
        employee: true,
        patient: true,
      },
    });

    if (!user) {
      this.log(`[AuthService] User not found: "${username}"`);
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    this.log(`[AuthService] Password match: ${isPasswordValid}`);
    
    if (isPasswordValid) {
      this.log(`[AuthService] Login successful: ${user.username}`);
      const { passwordHash, ...result } = user;
      return result;
    }
    
    this.log(`[AuthService] Invalid password for: ${user.username}`);
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
