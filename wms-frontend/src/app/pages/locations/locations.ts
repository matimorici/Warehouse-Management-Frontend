import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LocationInfo, LocationService } from '../../services/location.service';
import { PageTopbarComponent } from '../../shared/page-topbar';

@Component({
  selector: 'app-locations',
  standalone: true,
  imports: [CommonModule, FormsModule, PageTopbarComponent],
  templateUrl: './locations.html',
})
export class LocationsComponent implements OnInit {
  locations: LocationInfo[] = [];
  form = { name: '' };
  editingId: number | null = null;

  loading = false;
  saving = false;
  errorMessage = '';
  successMessage = '';
  listMessage = '';

  constructor(private locationService: LocationService) {}

  ngOnInit(): void {
    this.loadLocations();
  }

  loadLocations(): void {
    this.loading = true;
    this.listMessage = '';

    this.locationService.list().subscribe({
      next: (locations) => {
        this.locations = locations;
        this.loading = false;

        if (locations.length === 0) {
          this.listMessage = 'No hay ubicaciones cargadas';
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('Error al cargar ubicaciones:', err);
        this.listMessage = err.error?.error || 'No se pudieron cargar las ubicaciones';
      },
    });
  }

  editLocation(location: LocationInfo): void {
    this.editingId = location.id;
    this.form = { name: location.name };
    this.errorMessage = '';
    this.successMessage = '';
  }

  cancelEdit(): void {
    this.editingId = null;
    this.form = { name: '' };
  }

  deleteLocation(id: number): void {
    if (!confirm('¿Estás seguro de eliminar esta ubicación?')) {
      return;
    }

    this.locationService.delete(id).subscribe({
      next: () => {
        this.successMessage = 'Ubicación eliminada correctamente';
        if (this.editingId === id) {
          this.cancelEdit();
        }
        this.loadLocations();
      },
      error: (err) => {
        console.error('Error al eliminar ubicación:', err);
        this.errorMessage = err.error?.error || 'No se pudo eliminar la ubicación';
      },
    });
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.saving = true;

    const request =
      this.editingId !== null
        ? this.locationService.update(this.editingId, this.form)
        : this.locationService.create(this.form);

    request.subscribe({
      next: () => {
        this.saving = false;
        this.successMessage = this.editingId !== null
          ? 'Ubicación actualizada correctamente'
          : 'Ubicación creada correctamente';
        this.cancelEdit();
        this.loadLocations();
      },
      error: (err) => {
        this.saving = false;
        console.error('Error al guardar ubicación:', err);
        this.errorMessage = err.error?.error || 'No se pudo guardar la ubicación';
      },
    });
  }
}
