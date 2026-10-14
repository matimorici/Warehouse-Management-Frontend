import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProviderForm, ProviderService } from '../../services/provider.service';
import { PageTopbarComponent } from '../../shared/page-topbar';

@Component({
  selector: 'app-providers',
  standalone: true,
  imports: [CommonModule, FormsModule, PageTopbarComponent],
  templateUrl: './providers.html',
})
export class ProvidersComponent implements OnInit {
  readonly cuitPattern = '^(?:\\d{2}-\\d{8}-\\d{1}|\\d{11})$';

  form: ProviderForm = this.emptyForm();
  readonly providers = signal<ProviderForm[]>([]);
  editingId: number | null = null;

  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');
  readonly listMessage = signal('');

  constructor(private providerService: ProviderService) {}

  ngOnInit(): void {
    this.loadProviders();
  }

  private emptyForm(): ProviderForm {
    return {
      cuit: '',
      razonSocial: '',
      telefono: '',
      mail: '',
      direccion: '',
    };
  }

  loadProviders(): void {
    this.loading.set(true);
    this.listMessage.set('');

    this.providerService.getProviders().subscribe({
      next: (providers) => {
        this.providers.set(providers);
        this.loading.set(false);

        if (providers.length === 0) {
          this.listMessage.set('No hay proveedores cargados');
        }
      },
      error: (err) => {
        this.loading.set(false);
        console.error('Error al cargar proveedores:', err);
        this.listMessage.set(err.error?.error || 'No se pudieron cargar los proveedores');
      },
    });
  }

  editProvider(provider: ProviderForm): void {
    this.editingId = provider.idProveedor ?? null;
    this.form = {
      cuit: provider.cuit,
      razonSocial: provider.razonSocial,
      telefono: provider.telefono,
      mail: provider.mail,
      direccion: provider.direccion,
    };
    this.errorMessage.set('');
    this.successMessage.set('');
  }

  cancelEdit(): void {
    this.editingId = null;
    this.form = this.emptyForm();
  }

  deleteProvider(id: number | undefined): void {
    if (!id || !confirm('¿Estás seguro de eliminar este proveedor?')) {
      return;
    }

    this.providerService.deleteProvider(id).subscribe({
      next: () => {
        this.successMessage.set('Proveedor eliminado correctamente');
        if (this.editingId === id) {
          this.cancelEdit();
        }
        this.loadProviders();
      },
      error: (err) => {
        console.error('Error al eliminar proveedor:', err);
        this.errorMessage.set(err.error?.error || 'No se pudo eliminar el proveedor');
      },
    });
  }

  onSubmit(): void {
    this.errorMessage.set('');
    this.successMessage.set('');
    this.saving.set(true);

    const request =
      this.editingId !== null
        ? this.providerService.updateProvider(this.editingId, this.form)
        : this.providerService.createProvider(this.form);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.successMessage.set(this.editingId !== null
          ? 'Proveedor actualizado correctamente'
          : 'Proveedor cargado correctamente');
        this.cancelEdit();
        this.loadProviders();
      },
      error: (err) => {
        this.saving.set(false);
        console.error('Error al guardar proveedor:', err);
        this.errorMessage.set(err.error?.error || 'No se pudo guardar el proveedor');
      },
    });
  }
}
