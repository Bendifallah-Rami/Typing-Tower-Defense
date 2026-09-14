import { Controller, Post, Get, Body, Query, UseGuards, Request } from '@nestjs/common';
import { SessionsService } from './sessions.service.js';
import { CreateSessionDto } from './sessions.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@Controller('sessions')
@UseGuards(JwtAuthGuard)
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post()
  async create(@Request() req: any, @Body() dto: CreateSessionDto) {
    return this.sessionsService.create(req.user.id, dto);
  }

  @Get()
  async getHistory(@Request() req: any, @Query('page') page: string) {
    const pageNum = parseInt(page, 10) || 1;
    return this.sessionsService.findHistory(req.user.id, pageNum);
  }
}
