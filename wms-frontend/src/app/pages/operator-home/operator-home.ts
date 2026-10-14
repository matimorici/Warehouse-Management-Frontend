import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PageTopbarComponent } from '../../shared/page-topbar';

interface OperatorTask {
  label: string;
  description: string;
  route: string;
}

@Component({
  selector: 'app-operator-home',
  standalone: true,
  imports: [CommonModule, RouterLink, PageTopbarComponent],
  templateUrl: './operator-home.html',
})
export class OperatorHomeComponent {
  readonly tasks: OperatorTask[] = [
    {
      label: 'Órdenes de retiro',
      description: 'Consultá y prepará las solicitudes de retiro de mercadería.',
      route: '/ordenes-retiro',
    },
    {
      label: 'Órdenes de compra',
      description: 'Revisá los pedidos y registrá la recepción de mercadería.',
      route: '/ordenes-compra',
    },
    {
      label: 'Movimientos físicos',
      description: 'Registrá entradas, salidas y traslados entre ubicaciones.',
      route: '/movimientos-fisicos',
    },
    {
      label: 'Productos',
      description: 'Consultá el catálogo y el stock disponible de cada artículo.',
      route: '/productos',
    },
    {
      label: 'Ubicaciones',
      description: 'Consultá las ubicaciones físicas del depósito.',
      route: '/ubicaciones',
    },
  ];
}
