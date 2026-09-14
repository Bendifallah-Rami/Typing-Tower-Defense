var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Controller, Post, Get, Body, Query, UseGuards, Request } from '@nestjs/common';
import { SessionsService } from './sessions.service.js';
import { CreateSessionDto } from './sessions.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
let SessionsController = class SessionsController {
    sessionsService;
    constructor(sessionsService) {
        this.sessionsService = sessionsService;
    }
    async create(req, dto) {
        return this.sessionsService.create(req.user.id, dto);
    }
    async getHistory(req, page) {
        const pageNum = parseInt(page, 10) || 1;
        return this.sessionsService.findHistory(req.user.id, pageNum);
    }
};
__decorate([
    Post(),
    __param(0, Request()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CreateSessionDto]),
    __metadata("design:returntype", Promise)
], SessionsController.prototype, "create", null);
__decorate([
    Get(),
    __param(0, Request()),
    __param(1, Query('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], SessionsController.prototype, "getHistory", null);
SessionsController = __decorate([
    Controller('sessions'),
    UseGuards(JwtAuthGuard),
    __metadata("design:paramtypes", [SessionsService])
], SessionsController);
export { SessionsController };
//# sourceMappingURL=sessions.controller.js.map