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
let DashboardService = class DashboardService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getStatsForUser(userId) {
        const sessions = await this.prisma.gameSession.findMany({
            where: { userId },
            orderBy: { playedAt: 'desc' },
        });
        const totalGames = sessions.length;
        let bestScore = 0;
        let bestWpm = 0;
        let totalAccuracy = 0;
        let totalPlayTime = 0;
        for (const session of sessions) {
            if (session.score > bestScore)
                bestScore = session.score;
            if (session.maxWpm > bestWpm)
                bestWpm = session.maxWpm;
            totalAccuracy += session.accuracy;
            totalPlayTime += session.duration;
        }
        const avgAccuracy = totalGames > 0 ? totalAccuracy / totalGames : 0;
        const allUserMaxScores = await this.prisma.gameSession.groupBy({
            by: ['userId'],
            _max: {
                score: true,
            },
        });
        allUserMaxScores.sort((a, b) => (b._max.score || 0) - (a._max.score || 0));
        let globalRank = allUserMaxScores.findIndex(s => s.userId === userId) + 1;
        if (globalRank === 0 && totalGames > 0) {
            globalRank = allUserMaxScores.length;
        }
        else if (totalGames === 0) {
            globalRank = 0;
        }
        const recentGames = sessions.slice(0, 5);
        const chronologicalSessions = [...sessions].reverse();
        const progressionData = chronologicalSessions.slice(-20).map(s => ({
            date: s.playedAt.toISOString(),
            score: s.score,
            wpm: s.maxWpm,
        }));
        return {
            totalGames,
            bestScore,
            bestWpm,
            avgAccuracy,
            totalPlayTime,
            globalRank,
            recentGames,
            progressionData,
        };
    }
};
DashboardService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], DashboardService);
export { DashboardService };
//# sourceMappingURL=dashboard.service.js.map