import { Component, OnInit } from '@angular/core';
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
  users: UserInfo[] = [];
  currentUserId: number | null = null;
  loading = false;
  errorMessage = '';
  successMessage = '';
  listMessage = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.currentUserId = this.authService.getCurrentUserId();
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.listMessage = '';

    this.authService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;

        if (users.length === 0) {
          this.listMessage = 'No hay usuarios registrados';
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('Error al cargar usuarios:', err);
        this.listMessage = err.error?.error || 'No se pudieron cargar los usuarios';
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
      this.errorMessage = 'No podés eliminar tu propio usuario';
      return;
    }

    if (!confirm(`¿Estás seguro de eliminar a ${user.nombre} ${user.apellido}?`)) {
      return;
    }

    this.authService.deleteUser(user.idUsuario).subscribe({
      next: () => {
        this.successMessage = 'Usuario eliminado correctamente';
        this.loadUsers();
      },
      error: (err) => {
        console.error('Error al eliminar usuario:', err);
        this.errorMessage = err.error?.error || 'No se pudo eliminar el usuario';
      },
    });
  }
}
