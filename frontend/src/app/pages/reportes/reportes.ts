import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Reporte {
  codigo: string;
  tipo: string;
  periodo: string;
  responsable: string;
  estado: string;
  fecha: string;
}

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './reportes.html',
  styleUrl: './reportes.scss',
})
export class Reportes {
  filtroTipo = '';

  reportes: Reporte[] = [
    {
      codigo: 'R001',
      tipo: 'Caja',
      periodo: 'Mayo 2026',
      responsable: 'Administrador',
      estado: 'Generado',
      fecha: '2026-05-02'
    },
    {
      codigo: 'R002',
      tipo: 'Almacén',
      periodo: 'Mayo 2026',
      responsable: 'Jefe de almacén',
      estado: 'Pendiente',
      fecha: '2026-05-02'
    },
    {
      codigo: 'R003',
      tipo: 'Cuentas',
      periodo: 'Abril 2026',
      responsable: 'Dueño',
      estado: 'Revisado',
      fecha: '2026-04-30'
    }
  ];

  get reportesFiltrados() {
    if (!this.filtroTipo) return this.reportes;
    return this.reportes.filter(r => r.tipo === this.filtroTipo);
  }

  get totalReportes() {
    return this.reportes.length;
  }

  get generados() {
    return this.reportes.filter(r => r.estado === 'Generado').length;
  }

  get pendientes() {
    return this.reportes.filter(r => r.estado === 'Pendiente').length;
  }

  generarReporte(tipo: string) {
    const nuevo: Reporte = {
      codigo: 'R' + String(this.reportes.length + 1).padStart(3, '0'),
      tipo,
      periodo: 'Mayo 2026',
      responsable: 'Administrador',
      estado: 'Generado',
      fecha: new Date().toISOString().substring(0, 10)
    };

    this.reportes.unshift(nuevo);
  }

  limpiarFiltro() {
    this.filtroTipo = '';
  }
}
