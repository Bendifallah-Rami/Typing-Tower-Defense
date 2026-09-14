import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateSessionDto } from './sessions.dto.js';

@Injectable()
export class SessionsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: CreateSessionDto) {
    if (data.maxWpm > 300 || data.accuracy > 100) {
      throw new BadRequestException('Invalid session data detected (anti-cheat)');
    }

    return this.prisma.gameSession.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async findHistory(userId: string, page = 1, limit = 20) {
    return this.prisma.gameSession.findMany({
      where: { userId },
      orderBy: { playedAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }
}
