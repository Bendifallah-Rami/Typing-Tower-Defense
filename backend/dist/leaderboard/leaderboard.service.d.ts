import { PrismaService } from '../prisma/prisma.service.js';
export declare class LeaderboardService {
    private prisma;
    constructor(prisma: PrismaService);
    getLeaderboard(period?: 'day' | 'week' | 'all', sort?: 'score' | 'wpm', limit?: number): Promise<{
        rank: number;
        username: string;
        score: number;
        maxWpm: number;
        accuracy: number;
        playedAt: Date;
    }[]>;
}
