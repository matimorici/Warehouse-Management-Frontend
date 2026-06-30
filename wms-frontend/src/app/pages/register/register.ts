import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
})
export class RegisterComponent {
  readonly nameMinLength = 3;
  readonly nameMaxLength = 150;
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

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.register(this.form).subscribe({
      next: (res) => {
        this.successMessage = 'User created successfully!';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Registration failed';
      },
    });
  }
}
