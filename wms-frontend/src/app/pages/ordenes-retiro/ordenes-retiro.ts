import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrdenRetiroService, OrdenRetiroResponse } from '../../services/orden-retiro.service';
import { AuthService, UserInfo } from '../../services/auth.service';
import { PageTopbarComponent } from '../../shared/page-topbar';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog';

@Component({
  selector: 'app-ordenes-retiro',
  standalone: true,
  imports: [CommonModule, RouterLink, PageTopbarComponent, ConfirmDialogComponent],
  templateUrl: './ordenes-retiro.html',
})
export class OrdenesRetiroComponent implements OnInit {
  readonly orders = signal<OrdenRetiroResponse[]>([]);
  readonly users = signal<UserInfo[]>([]);
  readonly loading = signal(false);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');
  readonly pendingDeleteId = signal<number | null>(null);

  constructor(
    private service: OrdenRetiroService,
    private authService: AuthService,
  ) {}

  get homeRoute(): string {
    return this.authService.getHomeRouteByRole(this.authService.getUserRole());
  }

  ngOnInit(): void {
    this.loadOrders();
    this.authService.getUsers().subscribe({
      next: (users) => this.users.set(users),
      error: (err) => console.error('Error al cargar nombres de usuarios:', err),
    });
  }

  loadOrders(): void {
    this.loading.set(true);
    this.errorMessage.set('');
    this.service.list().subscribe({
      next: (data) => {
        this.orders.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        console.error('Error al cargar órdenes de retiro:', err);
        this.errorMessage.set(err.error?.message || 'No se pudieron cargar las órdenes de retiro');
      },
    });
  }

  deleteOrder(id: number): void {
    this.pendingDeleteId.set(id);
  }

  confirmDelete(): void {
    const id = this.pendingDeleteId();
    if (id === null) return;
    this.pendingDeleteId.set(null);
    this.service.delete(id).subscribe({
      next: () => {
        this.successMessage.set('Orden de retiro eliminada correctamente');
        this.loadOrders();
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'No se pudo eliminar la orden de retiro');
      },
    });
  }

  cancelDelete(): void {
    this.pendingDeleteId.set(null);
  }

  getLineCount(order: OrdenRetiroResponse): number {
    return order.lineasRetiro?.length ?? 0;
  }

  userName(id: number): string {
    const user = this.users().find((item) => item.idUsuario === id);
    return user ? `${user.nombre} ${user.apellido}` : `Usuario #${id}`;
  }
}
