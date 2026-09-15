import { PrismaService } from '../prisma/prisma.service.js';
export declare class DashboardService {
    private prisma;
    constructor(prisma: PrismaService);
    getStatsForUser(userId: string): Promise<{
        totalGames: number;
        bestScore: number;
        bestWpm: number;
        avgAccuracy: number;
        totalPlayTime: number;
        globalRank: number;
        recentGames: {
            id: string;
            score: number;
            maxWpm: number;
            avgWpm: number;
            accuracy: number;
            wavesReached: number;
            duration: number;
            playedAt: Date;
            userId: string;
        }[];
        progressionData: {
            date: string;
            score: number;
            wpm: number;
        }[];
    }>;
}
