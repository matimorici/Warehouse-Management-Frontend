import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export type UserRole = 'ADMIN' | 'OPERARIO';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  register(data: {
    nombre: string;
    apellido: string;
    cuil: string;
    contrasena: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuarios`, data);
  }

  login(data: { cuil: string; contrasena: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, data);
  }

  saveSession(data: unknown): void {
    const role = this.extractRole(data);

    if (role) {
      localStorage.setItem('userRole', role);
    }
  }

  getUserRole(): UserRole | null {
    return this.normalizeRole(localStorage.getItem('userRole'));
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
    const roleValue = this.findFirstString(data, ['role', 'rol', 'tipoUsuario', 'tipo_usuario', 'tipo']);

    return this.normalizeRole(roleValue);
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

    if (normalizedRole === 'ADMIN' || normalizedRole === 'OPERARIO') {
      return normalizedRole;
    }

    return null;
  }

  getUsers(): Observable<UserInfo[]> {
    return this.http.get<unknown>(`${this.apiUrl}/usuarios`).pipe(
      map((response) => this.normalizeUsers(response)),
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
}
