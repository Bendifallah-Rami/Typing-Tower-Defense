import { AuthService } from './auth.service.js';
import { LoginDto, SignupDto } from './auth.dto.js';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    signup(signupDto: SignupDto): Promise<{
        email: string;
        username: string;
        id: string;
        createdAt: Date;
    }>;
    getProfile(req: any): any;
}
