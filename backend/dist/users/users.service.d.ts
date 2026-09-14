import { PrismaService } from '../prisma/prisma.service.js';
import { Prisma } from '@prisma/client';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findOneByEmail(email: string): Promise<{
        id: string;
        email: string;
        username: string;
        passwordHash: string;
        createdAt: Date;
    } | null>;
    findOneByUsername(username: string): Promise<{
        id: string;
        email: string;
        username: string;
        passwordHash: string;
        createdAt: Date;
    } | null>;
    findOneById(id: string): Promise<{
        id: string;
        email: string;
        username: string;
        passwordHash: string;
        createdAt: Date;
    } | null>;
    create(data: Prisma.UserCreateInput): Promise<{
        id: string;
        email: string;
        username: string;
        passwordHash: string;
        createdAt: Date;
    }>;
}
