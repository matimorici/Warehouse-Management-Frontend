import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProviderForm, ProviderService } from '../../services/provider.service';

@Component({
  selector: 'app-providers',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './providers.html',
})
export class ProvidersComponent {
  readonly uuidPattern = '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$';
  readonly cuitPattern = '^(?:\\d{2}-\\d{8}-\\d{1}|\\d{11})$';

  form: ProviderForm = {
    id_proveedor: '',
    cuit: '',
    razon_social: '',
    telefono: '',
    mail: '',
    direccion: '',
  };

  errorMessage = '';
  successMessage = '';

  constructor(private providerService: ProviderService) {}

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    this.providerService.createProvider(this.form).subscribe({
      next: (res) => {
        this.successMessage = 'Proveedor cargado correctamente';
        this.form = {
          id_proveedor: '',
          cuit: '',
          razon_social: '',
          telefono: '',
          mail: '',
          direccion: '',
        };
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'No se pudo cargar el proveedor';
      },
    });
  }
}
