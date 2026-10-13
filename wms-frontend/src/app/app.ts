import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('wms-frontend');

  private readonly http = inject(HttpClient);

  constructor() {
    // Warm up the CSRF cookie (XSRF-TOKEN) on startup. A GET makes the backend
    // issue the cookie (even if the request itself returns 403), so Angular can
    // echo it in the X-XSRF-TOKEN header on the first POST (login).
    this.http.get('/api/productos').subscribe({ error: () => {} });
  }
}
