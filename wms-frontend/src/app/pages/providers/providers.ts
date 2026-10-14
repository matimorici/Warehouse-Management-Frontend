import { Component, OnInit } from '@angular/core';
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
  providers: ProviderForm[] = [];
  editingId: number | null = null;

  loading = false;
  saving = false;
  errorMessage = '';
  successMessage = '';
  listMessage = '';

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
    this.loading = true;
    this.listMessage = '';

    this.providerService.getProviders().subscribe({
      next: (providers) => {
        this.providers = providers;
        this.loading = false;

        if (providers.length === 0) {
          this.listMessage = 'No hay proveedores cargados';
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('Error al cargar proveedores:', err);
        this.listMessage = err.error?.error || 'No se pudieron cargar los proveedores';
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
    this.errorMessage = '';
    this.successMessage = '';
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
        this.successMessage = 'Proveedor eliminado correctamente';
        if (this.editingId === id) {
          this.cancelEdit();
        }
        this.loadProviders();
      },
      error: (err) => {
        console.error('Error al eliminar proveedor:', err);
        this.errorMessage = err.error?.error || 'No se pudo eliminar el proveedor';
      },
    });
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.saving = true;

    const request =
      this.editingId !== null
        ? this.providerService.updateProvider(this.editingId, this.form)
        : this.providerService.createProvider(this.form);

    request.subscribe({
      next: () => {
        this.saving = false;
        this.successMessage = this.editingId !== null
          ? 'Proveedor actualizado correctamente'
          : 'Proveedor cargado correctamente';
        this.cancelEdit();
        this.loadProviders();
      },
      error: (err) => {
        this.saving = false;
        console.error('Error al guardar proveedor:', err);
        this.errorMessage = err.error?.error || 'No se pudo guardar el proveedor';
      },
    });
  }
}
