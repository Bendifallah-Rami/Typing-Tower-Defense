import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStatsForUser(userId: string) {
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
      if (session.score > bestScore) bestScore = session.score;
      if (session.maxWpm > bestWpm) bestWpm = session.maxWpm;
      totalAccuracy += session.accuracy;
      totalPlayTime += session.duration;
    }

    const avgAccuracy = totalGames > 0 ? totalAccuracy / totalGames : 0;

    // Calculate global rank based on max score
    // We count how many distinct users have a max score greater than the current user's best score.
    // For simplicity with sqlite/prisma, we can group by userId.
    const allUserMaxScores = await this.prisma.gameSession.groupBy({
      by: ['userId'],
      _max: {
        score: true,
      },
    });
    
    // Sort descending by max score
    allUserMaxScores.sort((a, b) => (b._max.score || 0) - (a._max.score || 0));
    
    let globalRank = allUserMaxScores.findIndex(s => s.userId === userId) + 1;
    if (globalRank === 0 && totalGames > 0) {
       globalRank = allUserMaxScores.length; // shouldn't happen, but just in case
    } else if (totalGames === 0) {
       globalRank = 0; // Unranked
    }

    const recentGames = sessions.slice(0, 5);
    
    // Reverse the sessions to get chronological order for progression chart
    const chronologicalSessions = [...sessions].reverse();
    // Take the last 20 games for progression chart to avoid massive payloads
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
}
