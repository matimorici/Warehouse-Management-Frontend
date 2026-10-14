import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
})
export class LoginComponent {
  form = {
    cuil: '',
    contrasena: '',
  };

  readonly errorMessage = signal('');

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onSubmit() {
    this.errorMessage.set('');

    this.authService.login(this.form).subscribe({
      next: (res) => {
        this.authService.saveSession(res);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Credenciales inválidas');
      },
    });
  }
}
