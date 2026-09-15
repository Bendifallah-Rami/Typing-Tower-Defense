var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
let LeaderboardService = class LeaderboardService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getLeaderboard(period = 'all', sort = 'score', limit = 50) {
        let dateFilter = {};
        const now = new Date();
        if (period === 'day') {
            const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            dateFilter = { playedAt: { gte: yesterday } };
        }
        else if (period === 'week') {
            const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            dateFilter = { playedAt: { gte: lastWeek } };
        }
        const orderBy = sort === 'wpm' ? { maxWpm: 'desc' } : { score: 'desc' };
        const topSessions = await this.prisma.gameSession.findMany({
            where: dateFilter,
            orderBy,
            distinct: ['userId'],
            take: limit,
            include: {
                user: { select: { username: true } },
            },
        });
        return topSessions.map((session, index) => ({
            rank: index + 1,
            username: session.user.username,
            score: session.score,
            maxWpm: session.maxWpm,
            accuracy: session.accuracy,
            playedAt: session.playedAt,
        }));
    }
};
LeaderboardService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], LeaderboardService);
export { LeaderboardService };
//# sourceMappingURL=leaderboard.service.js.map