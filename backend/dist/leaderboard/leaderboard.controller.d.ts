import { LeaderboardService } from './leaderboard.service.js';
export declare class LeaderboardController {
    private readonly leaderboardService;
    constructor(leaderboardService: LeaderboardService);
    getLeaderboard(period?: 'day' | 'week' | 'all', sort?: 'score' | 'wpm', limit?: string): Promise<{
        rank: number;
        username: string;
        score: number;
        maxWpm: number;
        accuracy: number;
        playedAt: Date;
    }[]>;
}
