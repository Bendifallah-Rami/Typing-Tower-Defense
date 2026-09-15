import { DashboardService } from './dashboard.service.js';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getDashboardStats(req: any): Promise<{
        totalGames: number;
        bestScore: number;
        bestWpm: number;
        avgAccuracy: number;
        totalPlayTime: number;
        globalRank: number;
        recentGames: {
            id: string;
            userId: string;
            score: number;
            maxWpm: number;
            avgWpm: number;
            accuracy: number;
            wavesReached: number;
            duration: number;
            playedAt: Date;
        }[];
        progressionData: {
            date: string;
            score: number;
            wpm: number;
        }[];
    }>;
}
