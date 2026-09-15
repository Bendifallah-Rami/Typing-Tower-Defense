import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class LeaderboardService {
  constructor(private prisma: PrismaService) {}

  async getLeaderboard(period: 'day' | 'week' | 'all' = 'all', sort: 'score' | 'wpm' = 'score', limit = 50) {
    let dateFilter = {};
    const now = new Date();
    
    if (period === 'day') {
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      dateFilter = { playedAt: { gte: yesterday } };
    } else if (period === 'week') {
      const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      dateFilter = { playedAt: { gte: lastWeek } };
    }

    const orderBy = sort === 'wpm' ? { maxWpm: 'desc' as const } : { score: 'desc' as const };

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
}
