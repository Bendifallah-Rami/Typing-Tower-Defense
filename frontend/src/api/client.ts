// ═══════════════════════════════════════════════════════════
// API Client — Backend HTTP communication
// ═══════════════════════════════════════════════════════════

import axios from 'axios';
import type {
  AuthTokens,
  LoginRequest,
  RegisterRequest,
  User,
  GameSessionPayload,
  GameSessionRecord,
  LeaderboardEntry,
  LeaderboardPeriod,
  LeaderboardSort,
  DashboardStats,
} from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── JWT Interceptor ─────────────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ttd_access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Try refresh token
      const refreshToken = localStorage.getItem('ttd_refresh_token');
      if (refreshToken) {
        try {
          const { data } = await axios.post(`${API_BASE}/auth/refresh`, {
            refreshToken,
          });
          localStorage.setItem('ttd_access_token', data.accessToken);
          localStorage.setItem('ttd_refresh_token', data.refreshToken);

          // Retry original request
          error.config.headers.Authorization = `Bearer ${data.accessToken}`;
          return api.request(error.config);
        } catch {
          // Refresh failed — logout
          localStorage.removeItem('ttd_access_token');
          localStorage.removeItem('ttd_refresh_token');
        }
      }
    }
    return Promise.reject(error);
  },
);

// ─── Auth ────────────────────────────────────────────────
export async function login(data: LoginRequest): Promise<AuthTokens> {
  const response = await api.post<AuthTokens>('/auth/login', data);
  localStorage.setItem('ttd_access_token', response.data.accessToken);
  localStorage.setItem('ttd_refresh_token', response.data.refreshToken);
  return response.data;
}

export async function register(data: RegisterRequest): Promise<void> {
  await api.post('/auth/signup', data);
}

export async function getMe(): Promise<User> {
  const response = await api.get<User>('/auth/me');
  return response.data;
}

export function logout(): void {
  localStorage.removeItem('ttd_access_token');
  localStorage.removeItem('ttd_refresh_token');
}

export function isLoggedIn(): boolean {
  return !!localStorage.getItem('ttd_access_token');
}

// ─── Sessions ────────────────────────────────────────────
export async function submitSession(data: GameSessionPayload): Promise<GameSessionRecord> {
  const response = await api.post<GameSessionRecord>('/sessions', data);
  return response.data;
}

export async function getHistory(page = 1, limit = 20): Promise<GameSessionRecord[]> {
  const response = await api.get<GameSessionRecord[]>('/sessions', {
    params: { page, limit },
  });
  return response.data;
}

// ─── Leaderboard ─────────────────────────────────────────
export async function getLeaderboard(
  period: LeaderboardPeriod = 'all',
  sort: LeaderboardSort = 'score',
  limit = 50,
): Promise<LeaderboardEntry[]> {
  const response = await api.get<LeaderboardEntry[]>('/leaderboard', {
    params: { period, sort, limit },
  });
  return response.data;
}

// ─── Dashboard ───────────────────────────────────────────
export async function getDashboardStats(): Promise<DashboardStats> {
  const response = await api.get<DashboardStats>('/dashboard');
  return response.data;
}

export default api;
