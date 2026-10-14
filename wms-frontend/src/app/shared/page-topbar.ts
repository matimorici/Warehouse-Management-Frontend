import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-page-topbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <header class="wms-topbar">
      <div class="wms-topbar-inner">
        <a class="wms-mark" [routerLink]="homeRoute">
          <span>
            <strong>Gestión de almacén</strong>
            <span>{{ section }}</span>
          </span>
        </a>

        <div class="wms-topbar-actions">
          <div class="wms-session-identity" aria-label="Sesión iniciada">
            <span class="wms-session-name">{{ currentUserName || 'Usuario' }}</span>
            <span *ngIf="currentUserRole" class="wms-session-role">{{ currentUserRole }}</span>
          </div>

          <a *ngIf="showBack" [routerLink]="resolvedBackRoute" class="wms-action wms-action-secondary">
            {{ backLabel }}
          </a>

          <button type="button" class="wms-action wms-action-secondary" (click)="logout()">
            Cerrar sesión
          </button>
        </div>
      </div>
    </header>
  `,
})
export class PageTopbarComponent {
  @Input() section = '';
  @Input() backLabel = 'Volver al panel';
  @Input() backRoute = '';
  @Input() showBack = true;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  get homeRoute(): string {
    return this.authService.getHomeRouteByRole(this.authService.getUserRole());
  }

  get resolvedBackRoute(): string {
    return this.backRoute || this.homeRoute;
  }

  get currentUserName(): string {
    return this.authService.getCurrentUserName().trim();
  }

  get currentUserRole(): string {
    const role = this.authService.getUserRole();
    if (role === 'ADMIN') {
      return 'Administrador';
    }
    if (role === 'OPERARIO') {
      return 'Operario';
    }
    return '';
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => this.finishLogout(),
      error: () => this.finishLogout(),
    });
  }

  private finishLogout(): void {
    this.authService.clearSession();
    this.router.navigate(['/login']);
  }
}
