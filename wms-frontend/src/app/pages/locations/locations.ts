import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LocationInfo, LocationService } from '../../services/location.service';
import { PageTopbarComponent } from '../../shared/page-topbar';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog';

@Component({
  selector: 'app-locations',
  standalone: true,
  imports: [CommonModule, FormsModule, PageTopbarComponent, ConfirmDialogComponent],
  templateUrl: './locations.html',
})
export class LocationsComponent implements OnInit {
  readonly locations = signal<LocationInfo[]>([]);
  form = { name: '' };
  editingId: number | null = null;

  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');
  readonly listMessage = signal('');
  readonly pendingDelete = signal<LocationInfo | null>(null);

  constructor(private locationService: LocationService) {}

  ngOnInit(): void {
    this.loadLocations();
  }

  loadLocations(): void {
    this.loading.set(true);
    this.listMessage.set('');

    this.locationService.list().subscribe({
      next: (locations) => {
        this.locations.set(locations);
        this.loading.set(false);

        if (locations.length === 0) {
          this.listMessage.set('No hay ubicaciones cargadas');
        }
      },
      error: (err) => {
        this.loading.set(false);
        console.error('Error al cargar ubicaciones:', err);
        this.listMessage.set(err.error?.error || 'No se pudieron cargar las ubicaciones');
      },
    });
  }

  editLocation(location: LocationInfo): void {
    this.editingId = location.id;
    this.form = { name: location.name };
    this.errorMessage.set('');
    this.successMessage.set('');
  }

  cancelEdit(): void {
    this.editingId = null;
    this.form = { name: '' };
  }

  deleteLocation(id: number): void {
    const location = this.locations().find((item) => item.id === id);
    if (location) this.pendingDelete.set(location);
  }

  confirmDelete(): void {
    const location = this.pendingDelete();
    if (!location) return;
    this.pendingDelete.set(null);
    const id = location.id;
    this.locationService.delete(id).subscribe({
      next: () => {
        this.successMessage.set('Ubicación eliminada correctamente');
        if (this.editingId === id) {
          this.cancelEdit();
        }
        this.loadLocations();
      },
      error: (err) => {
        console.error('Error al eliminar ubicación:', err);
        this.errorMessage.set(err.error?.error || 'No se pudo eliminar la ubicación');
      },
    });
  }

  cancelDelete(): void {
    this.pendingDelete.set(null);
  }

  onSubmit(): void {
    this.errorMessage.set('');
    this.successMessage.set('');
    this.saving.set(true);

    const request =
      this.editingId !== null
        ? this.locationService.update(this.editingId, this.form)
        : this.locationService.create(this.form);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.successMessage.set(
          this.editingId !== null
            ? 'Ubicación actualizada correctamente'
            : 'Ubicación creada correctamente',
        );
        this.cancelEdit();
        this.loadLocations();
      },
      error: (err) => {
        this.saving.set(false);
        console.error('Error al guardar ubicación:', err);
        this.errorMessage.set(err.error?.error || 'No se pudo guardar la ubicación');
      },
    });
  }
}
