import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service.js';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto, SignupDto } from './auth.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && await bcrypt.compare(pass, user.passwordHash)) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    const payload = { email: user.email, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' })
    };
  }

  async signup(signupDto: SignupDto) {
    const existingEmail = await this.usersService.findOneByEmail(signupDto.email);
    if (existingEmail) {
      throw new ConflictException('Email already in use');
    }
    const existingUsername = await this.usersService.findOneByUsername(signupDto.username);
    if (existingUsername) {
      throw new ConflictException('Username already in use');
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(signupDto.password, salt);

    const user = await this.usersService.create({
      email: signupDto.email,
      username: signupDto.username,
      passwordHash,
    });

    const { passwordHash: _, ...result } = user;
    return result;
  }
}
