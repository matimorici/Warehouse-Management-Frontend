import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  SupplierRatingForm,
  SupplierRatingInfo,
  SupplierRatingService,
} from '../../services/supplier-rating.service';
import { ProviderForm, ProviderService } from '../../services/provider.service';
import { PageTopbarComponent } from '../../shared/page-topbar';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog';

@Component({
  selector: 'app-supplier-ratings',
  standalone: true,
  imports: [CommonModule, FormsModule, PageTopbarComponent, ConfirmDialogComponent],
  templateUrl: './supplier-ratings.html',
})
export class SupplierRatingsComponent implements OnInit {
  readonly ratings = signal<SupplierRatingInfo[]>([]);
  readonly providers = signal<ProviderForm[]>([]);
  selectedSupplierFilter: number | null = null;

  form: SupplierRatingForm = this.emptyForm();
  editingId: number | null = null;

  readonly loading = signal(false);
  readonly loadingProviders = signal(false);
  readonly saving = signal(false);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');
  readonly listMessage = signal('');
  readonly pendingDeleteId = signal<number | null>(null);

  constructor(
    private ratingService: SupplierRatingService,
    private providerService: ProviderService,
  ) {}

  ngOnInit(): void {
    this.loadProviders();
    this.loadRatings();
  }

  private emptyForm(): SupplierRatingForm {
    return {
      idSupplier: null,
      deliveryTime: null,
      deliveryMethod: '',
      priceQualityRatio: '',
    };
  }

  loadProviders(): void {
    this.loadingProviders.set(true);
    this.providerService.getProviders().subscribe({
      next: (providers) => {
        this.providers.set(providers);
        this.loadingProviders.set(false);
      },
      error: (err) => {
        this.loadingProviders.set(false);
        console.error('Error al cargar proveedores:', err);
      },
    });
  }

  loadRatings(): void {
    this.loading.set(true);
    this.listMessage.set('');

    this.ratingService.list(this.selectedSupplierFilter).subscribe({
      next: (ratings) => {
        this.ratings.set(ratings);
        this.loading.set(false);

        if (ratings.length === 0) {
          this.listMessage.set('No hay valoraciones registradas');
        }
      },
      error: (err) => {
        this.loading.set(false);
        console.error('Error al cargar valoraciones:', err);
        this.listMessage.set(err.error?.error || 'No se pudieron cargar las valoraciones');
      },
    });
  }

  onFilterChange(): void {
    this.loadRatings();
  }

  providerName(id: number): string {
    const provider = this.providers().find((p) => p.idProveedor === id);
    return provider ? provider.razonSocial : `Proveedor #${id}`;
  }

  editRating(rating: SupplierRatingInfo): void {
    this.editingId = rating.id;
    this.form = {
      idSupplier: rating.idSupplier,
      deliveryTime: rating.deliveryTime,
      deliveryMethod: rating.deliveryMethod,
      priceQualityRatio: rating.priceQualityRatio,
    };
    this.errorMessage.set('');
    this.successMessage.set('');
  }

  cancelEdit(): void {
    this.editingId = null;
    this.form = this.emptyForm();
  }

  deleteRating(id: number): void {
    this.pendingDeleteId.set(id);
  }

  confirmDelete(): void {
    const id = this.pendingDeleteId();
    if (id === null) return;
    this.pendingDeleteId.set(null);
    this.ratingService.delete(id).subscribe({
      next: () => {
        this.successMessage.set('Valoración eliminada correctamente');
        if (this.editingId === id) {
          this.cancelEdit();
        }
        this.loadRatings();
      },
      error: (err) => {
        console.error('Error al eliminar valoración:', err);
        this.errorMessage.set(err.error?.error || 'No se pudo eliminar la valoración');
      },
    });
  }

  cancelDelete(): void {
    this.pendingDeleteId.set(null);
  }

  onSubmit(): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    if (!this.form.idSupplier) {
      this.errorMessage.set('Tenés que seleccionar un proveedor');
      return;
    }

    this.saving.set(true);

    const request =
      this.editingId !== null
        ? this.ratingService.update(this.editingId, this.form)
        : this.ratingService.create(this.form);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.successMessage.set(
          this.editingId !== null
            ? 'Valoración actualizada correctamente'
            : 'Valoración registrada correctamente',
        );
        this.cancelEdit();
        this.loadRatings();
      },
      error: (err) => {
        this.saving.set(false);
        console.error('Error al guardar valoración:', err);
        this.errorMessage.set(err.error?.error || 'No se pudo guardar la valoración');
      },
    });
  }
}
