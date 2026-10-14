import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './forbidden.html',
})
export class ForbiddenComponent {
  constructor(private authService: AuthService) {}

  get homeRoute(): string {
    return this.authService.getHomeRouteByRole(this.authService.getUserRole());
  }
}
