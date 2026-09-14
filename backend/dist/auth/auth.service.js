var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service.js';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
let AuthService = class AuthService {
    usersService;
    jwtService;
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    async validateUser(email, pass) {
        const user = await this.usersService.findOneByEmail(email);
        if (user && await bcrypt.compare(pass, user.passwordHash)) {
            const { passwordHash, ...result } = user;
            return result;
        }
        return null;
    }
    async login(loginDto) {
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
    async signup(signupDto) {
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
};
AuthService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [UsersService,
        JwtService])
], AuthService);
export { AuthService };
//# sourceMappingURL=auth.service.js.map