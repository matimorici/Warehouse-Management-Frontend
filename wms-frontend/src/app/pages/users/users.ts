import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService, UserInfo } from '../../services/auth.service';
import { PageTopbarComponent } from '../../shared/page-topbar';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, RouterLink, PageTopbarComponent],
  templateUrl: './users.html',
})
export class UsersComponent implements OnInit {
  readonly users = signal<UserInfo[]>([]);
  currentUserId: number | null = null;
  readonly loading = signal(false);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');
  readonly listMessage = signal('');

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.currentUserId = this.authService.getCurrentUserId();
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading.set(true);
    this.listMessage.set('');

    this.authService.getUsers().subscribe({
      next: (users) => {
        this.users.set(users);
        this.loading.set(false);

        if (users.length === 0) {
          this.listMessage.set('No hay usuarios registrados');
        }
      },
      error: (err) => {
        this.loading.set(false);
        console.error('Error al cargar usuarios:', err);
        this.listMessage.set(err.error?.error || 'No se pudieron cargar los usuarios');
      },
    });
  }

  roleLabel(role: string | undefined): string {
    if (role === 'ADMINISTRADOR') {
      return 'Administrador';
    }
    if (role === 'OPERARIO') {
      return 'Operario';
    }
    return role || '—';
  }

  deleteUser(user: UserInfo): void {
    if (user.idUsuario === this.currentUserId) {
      this.errorMessage.set('No podés eliminar tu propio usuario');
      return;
    }

    if (!confirm(`¿Estás seguro de eliminar a ${user.nombre} ${user.apellido}?`)) {
      return;
    }

    this.authService.deleteUser(user.idUsuario).subscribe({
      next: () => {
        this.successMessage.set('Usuario eliminado correctamente');
        this.loadUsers();
      },
      error: (err) => {
        console.error('Error al eliminar usuario:', err);
        this.errorMessage.set(err.error?.error || 'No se pudo eliminar el usuario');
      },
    });
  }
}
