import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RegisterComponent } from '../register/register';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [RegisterComponent, RouterLink],
  templateUrl: './admin-home.html',
})
export class AdminHomeComponent {}
