import { SessionsService } from './sessions.service.js';
import { CreateSessionDto } from './sessions.dto.js';
export declare class SessionsController {
    private readonly sessionsService;
    constructor(sessionsService: SessionsService);
    create(req: any, dto: CreateSessionDto): Promise<{
        score: number;
        maxWpm: number;
        avgWpm: number;
        accuracy: number;
        wavesReached: number;
        duration: number;
        id: string;
        playedAt: Date;
        userId: string;
    }>;
    getHistory(req: any, page: string): Promise<{
        score: number;
        maxWpm: number;
        avgWpm: number;
        accuracy: number;
        wavesReached: number;
        duration: number;
        id: string;
        playedAt: Date;
        userId: string;
    }[]>;
}
