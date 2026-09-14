import { SessionsService } from './sessions.service.js';
import { CreateSessionDto } from './sessions.dto.js';
export declare class SessionsController {
    private readonly sessionsService;
    constructor(sessionsService: SessionsService);
    create(req: any, dto: CreateSessionDto): Promise<{
        id: string;
        score: number;
        maxWpm: number;
        avgWpm: number;
        accuracy: number;
        wavesReached: number;
        duration: number;
        playedAt: Date;
        userId: string;
    }>;
    getHistory(req: any, page: string): Promise<{
        id: string;
        score: number;
        maxWpm: number;
        avgWpm: number;
        accuracy: number;
        wavesReached: number;
        duration: number;
        playedAt: Date;
        userId: string;
    }[]>;
}
