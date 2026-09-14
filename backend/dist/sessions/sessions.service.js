var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
let SessionsService = class SessionsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, data) {
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
    async findHistory(userId, page = 1, limit = 20) {
        return this.prisma.gameSession.findMany({
            where: { userId },
            orderBy: { playedAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
        });
    }
};
SessionsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], SessionsService);
export { SessionsService };
//# sourceMappingURL=sessions.service.js.map