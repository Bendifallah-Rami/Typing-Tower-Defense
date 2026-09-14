import { Controller, Get, Query } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service.js';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get()
  async getLeaderboard(
    @Query('period') period?: 'day' | 'week' | 'all',
    @Query('sort') sort?: 'score' | 'wpm',
    @Query('limit') limit?: string,
  ) {
    const parsedLimit = limit ? parseInt(limit, 10) : 50;
    return this.leaderboardService.getLeaderboard(period, sort, parsedLimit);
  }
}
