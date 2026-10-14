import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, timeout, catchError } from 'rxjs';
import { API_BASE_URL } from '../shared/api-config';

export type UserRole = 'ADMIN' | 'OPERARIO';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private get apiUrl(): string {
    return API_BASE_URL;
  }

  constructor(private http: HttpClient) {}

  register(data: {
    nombre: string;
    apellido: string;
    cuil: string;
    contrasena: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuarios`, data).pipe(
      timeout(15000),
      catchError((err) => {
        console.error('Error /api/usuarios:', err);
        throw err;
      }),
    );
  }

  login(data: { cuil: string; contrasena: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, data).pipe(
      timeout(15000),
      catchError((err) => {
        console.error('Error /api/auth/login:', err);
        throw err;
      }),
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/auth/logout`, {}).pipe(
      timeout(15000),
      catchError((err) => {
        console.error('Error /api/auth/logout:', err);
        throw err;
      }),
    );
  }

  saveSession(data: unknown): void {
    const role = this.extractRole(data);

    if (role) {
      localStorage.setItem('userRole', role);
    } else {
      localStorage.removeItem('userRole');
    }

    const id = this.findFirstNumber(data, ['idUsuario', 'id', 'idUser', 'id_usuario']);
    if (id !== null) {
      localStorage.setItem('userId', String(id));
    }

    const name = this.extractFullName(data);
    if (name) {
      localStorage.setItem('userName', name);
    }
  }

  clearSession(): void {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
  }

  getUserRole(): UserRole | null {
    return this.normalizeRole(localStorage.getItem('userRole'));
  }

  isAuthenticated(): boolean {
    return this.getUserRole() !== null;
  }

  getCurrentUserId(): number | null {
    const raw = localStorage.getItem('userId');
    if (!raw) {
      return null;
    }
    const parsed = Number(raw);
    return Number.isNaN(parsed) ? null : parsed;
  }

  getCurrentUserName(): string {
    return localStorage.getItem('userName') ?? '';
  }

  getHomeRouteByRole(role: UserRole | null): string {
    if (role === 'ADMIN') {
      return '/admin';
    }

    if (role === 'OPERARIO') {
      return '/operario';
    }

    return '/login';
  }

  private extractRole(data: unknown): UserRole | null {
    const roleValue = this.findFirstString(data, [
      'role',
      'rol',
      'tipoUsuario',
      'tipo_usuario',
      'tipo',
    ]);

    return this.normalizeRole(roleValue);
  }

  private findFirstNumber(data: unknown, keys: string[]): number | null {
    if (!this.isRecord(data)) {
      return null;
    }

    for (const key of keys) {
      const value = data[key];

      if (typeof value === 'number') {
        return value;
      }

      if (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value))) {
        return Number(value);
      }
    }

    for (const key of ['usuario', 'user', 'empleado']) {
      const nestedValue = this.findFirstNumber(data[key], keys);

      if (nestedValue !== null) {
        return nestedValue;
      }
    }

    return null;
  }

  private extractFullName(data: unknown): string | null {
    if (!this.isRecord(data)) {
      return null;
    }

    const nombre = typeof data['nombre'] === 'string' ? data['nombre'] : '';
    const apellido = typeof data['apellido'] === 'string' ? data['apellido'] : '';
    const combined = `${nombre} ${apellido}`.trim();

    return combined || null;
  }

  private findFirstString(data: unknown, keys: string[]): string | null {
    if (!this.isRecord(data)) {
      return null;
    }

    for (const key of keys) {
      const value = data[key];

      if (typeof value === 'string') {
        return value;
      }
    }

    for (const key of ['usuario', 'user', 'empleado']) {
      const nestedValue = this.findFirstString(data[key], keys);

      if (nestedValue) {
        return nestedValue;
      }
    }

    return null;
  }

  private normalizeRole(role: string | null): UserRole | null {
    const normalizedRole = role?.trim().toUpperCase();

    if (normalizedRole === 'ADMIN' || normalizedRole === 'ADMINISTRADOR') {
      return 'ADMIN';
    }

    if (normalizedRole === 'OPERARIO') {
      return normalizedRole;
    }

    return null;
  }

  getUsers(): Observable<UserInfo[]> {
    return this.http.get<unknown>(`${this.apiUrl}/usuarios`).pipe(
      timeout(15000),
      map((response) => this.normalizeUsers(response)),
      catchError((err) => {
        console.error('Error /api/usuarios:', err);
        throw err;
      }),
    );
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/usuarios/${id}`).pipe(
      timeout(15000),
      catchError((err) => {
        console.error('Error /api/usuarios/' + id + ':', err);
        throw err;
      }),
    );
  }

  private normalizeUsers(response: unknown): UserInfo[] {
    if (Array.isArray(response)) {
      return response as UserInfo[];
    }

    if (this.isRecord(response) && Array.isArray(response['content'])) {
      return response['content'] as UserInfo[];
    }

    return [];
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
  }
}

export interface UserInfo {
  idUsuario: number;
  nombre: string;
  apellido: string;
  cuil: string;
  rol?: string;
}
