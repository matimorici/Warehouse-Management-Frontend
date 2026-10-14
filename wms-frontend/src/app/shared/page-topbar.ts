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
