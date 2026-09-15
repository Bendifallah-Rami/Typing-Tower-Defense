import { PrismaService } from '../prisma/prisma.service.js';
import { CreateSessionDto } from './sessions.dto.js';
export declare class SessionsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, data: CreateSessionDto): Promise<{
        id: string;
        score: number;
        maxWpm: number;
        avgWpm: number;
        accuracy: number;
        wavesReached: number;
        duration: number;
        playedAt: Date;
        userId: string;
    }>;
    findHistory(userId: string, page?: number, limit?: number): Promise<{
        id: string;
        score: number;
        maxWpm: number;
        avgWpm: number;
        accuracy: number;
        wavesReached: number;
        duration: number;
        playedAt: Date;
        userId: string;
    }[]>;
}
