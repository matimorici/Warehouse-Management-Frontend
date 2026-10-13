import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface AdminSection {
  label: string;
  description: string;
  available: boolean;
  route?: string;
}

interface AdminGroup {
  title: string;
  hint: string;
  sections: AdminSection[];
}

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-home.html',
})
export class AdminHomeComponent {
  readonly mainGroups: AdminGroup[] = [
    {
      title: 'Operaciones',
      hint: 'Movimientos de mercadería',
      sections: [
        {
          label: 'Órdenes de retiro',
          description: 'Creá y gestioná las solicitudes de retiro de mercadería.',
          available: true,
          route: '/ordenes-retiro',
        },
        {
          label: 'Órdenes de compra',
          description: 'Cargá pedidos a proveedores y registrá su recepción.',
          available: false,
        },
        {
          label: 'Movimientos físicos',
          description: 'Registrá entradas, salidas y ajustes de stock.',
          available: false,
        },
      ],
    },
    {
      title: 'Catálogo',
      hint: 'Datos maestros del depósito',
      sections: [
        {
          label: 'Productos',
          description: 'Cargá artículos y mantené actualizado el inventario.',
          available: true,
          route: '/productos',
        },
        {
          label: 'Proveedores',
          description: 'Administrá los datos de contacto de los proveedores.',
          available: true,
          route: '/proveedores',
        },
        {
          label: 'Ubicaciones',
          description: 'Organizá las ubicaciones físicas dentro del depósito.',
          available: false,
        },
        {
          label: 'Valoraciones de proveedor',
          description: 'Consultá y cargá evaluaciones de desempeño de proveedores.',
          available: false,
        },
      ],
    },
  ];

  readonly adminGroup: AdminGroup = {
    title: 'Administración',
    hint: 'Cuentas y personal',
    sections: [
      {
        label: 'Registrar empleado',
        description: 'Creá una cuenta de acceso para el personal del depósito.',
        available: true,
        route: '/register',
      },
      {
        label: 'Usuarios',
        description: 'Consultá y administrá las cuentas existentes.',
        available: false,
      },
    ],
  };
}
