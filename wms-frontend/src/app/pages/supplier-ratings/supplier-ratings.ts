import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  SupplierRatingForm,
  SupplierRatingInfo,
  SupplierRatingService,
} from '../../services/supplier-rating.service';
import { ProviderForm, ProviderService } from '../../services/provider.service';
import { PageTopbarComponent } from '../../shared/page-topbar';

@Component({
  selector: 'app-supplier-ratings',
  standalone: true,
  imports: [CommonModule, FormsModule, PageTopbarComponent],
  templateUrl: './supplier-ratings.html',
})
export class SupplierRatingsComponent implements OnInit {
  ratings: SupplierRatingInfo[] = [];
  providers: ProviderForm[] = [];
  selectedSupplierFilter: number | null = null;

  form: SupplierRatingForm = this.emptyForm();
  editingId: number | null = null;

  loading = false;
  loadingProviders = false;
  saving = false;
  errorMessage = '';
  successMessage = '';
  listMessage = '';

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
    this.loadingProviders = true;
    this.providerService.getProviders().subscribe({
      next: (providers) => {
        this.providers = providers;
        this.loadingProviders = false;
      },
      error: (err) => {
        this.loadingProviders = false;
        console.error('Error al cargar proveedores:', err);
      },
    });
  }

  loadRatings(): void {
    this.loading = true;
    this.listMessage = '';

    this.ratingService.list(this.selectedSupplierFilter).subscribe({
      next: (ratings) => {
        this.ratings = ratings;
        this.loading = false;

        if (ratings.length === 0) {
          this.listMessage = 'No hay valoraciones registradas';
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('Error al cargar valoraciones:', err);
        this.listMessage = err.error?.error || 'No se pudieron cargar las valoraciones';
      },
    });
  }

  onFilterChange(): void {
    this.loadRatings();
  }

  providerName(id: number): string {
    const provider = this.providers.find((p) => p.idProveedor === id);
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
    this.errorMessage = '';
    this.successMessage = '';
  }

  cancelEdit(): void {
    this.editingId = null;
    this.form = this.emptyForm();
  }

  deleteRating(id: number): void {
    if (!confirm('¿Estás seguro de eliminar esta valoración?')) {
      return;
    }

    this.ratingService.delete(id).subscribe({
      next: () => {
        this.successMessage = 'Valoración eliminada correctamente';
        if (this.editingId === id) {
          this.cancelEdit();
        }
        this.loadRatings();
      },
      error: (err) => {
        console.error('Error al eliminar valoración:', err);
        this.errorMessage = err.error?.error || 'No se pudo eliminar la valoración';
      },
    });
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.form.idSupplier) {
      this.errorMessage = 'Tenés que seleccionar un proveedor';
      return;
    }

    this.saving = true;

    const request =
      this.editingId !== null
        ? this.ratingService.update(this.editingId, this.form)
        : this.ratingService.create(this.form);

    request.subscribe({
      next: () => {
        this.saving = false;
        this.successMessage = this.editingId !== null
          ? 'Valoración actualizada correctamente'
          : 'Valoración registrada correctamente';
        this.cancelEdit();
        this.loadRatings();
      },
      error: (err) => {
        this.saving = false;
        console.error('Error al guardar valoración:', err);
        this.errorMessage = err.error?.error || 'No se pudo guardar la valoración';
      },
    });
  }
}
