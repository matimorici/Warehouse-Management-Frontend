import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PageTopbarComponent } from '../../shared/page-topbar';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, PageTopbarComponent],
  templateUrl: './register.html',
})
export class RegisterComponent {
  readonly cuilPattern = '^(?:\\d{2}-\\d{8}-\\d{1}|\\d{11})$';
  readonly passwordPattern = '^(?=.*[A-Z])(?=.*[0-9]).{8,}$';

  form = {
    nombre: '',
    apellido: '',
    cuil: '',
    contrasena: '',
  };

  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.register(this.form).subscribe({
      next: () => {
        this.successMessage = 'Operario creado correctamente. Redirigiendo al listado...';
        this.form = {
          nombre: '',
          apellido: '',
          cuil: '',
          contrasena: '',
        };
        setTimeout(() => this.router.navigate(['/usuarios']), 1200);
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'No se pudo crear el operario';
      },
    });
  }
}
