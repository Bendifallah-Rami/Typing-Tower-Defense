import { UsersService } from '../users/users.service.js';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, SignupDto } from './auth.dto.js';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(email: string, pass: string): Promise<any>;
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    signup(signupDto: SignupDto): Promise<{
        id: string;
        email: string;
        username: string;
        createdAt: Date;
    }>;
}
