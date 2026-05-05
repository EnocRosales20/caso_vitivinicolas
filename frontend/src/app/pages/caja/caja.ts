import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface MovimientoCaja {
  tipo: string;
  cuenta: string;
  monto: number;
  fecha: string;
  motivo: string;
}

@Component({
  selector: 'app-caja',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './caja.html',
  styleUrl: './caja.scss',
})
export class Caja {
  movimiento: MovimientoCaja = {
    tipo: '',
    cuenta: '',
    monto: 0,
    fecha: '',
    motivo: ''
  };

  movimientos: MovimientoCaja[] = [
    {
      tipo: 'Depósito',
      cuenta: 'Caja Principal',
      monto: 1200,
      fecha: '2026-05-02',
      motivo: 'Venta de productos'
    },
    {
      tipo: 'Retiro',
      cuenta: 'Cuenta Corriente',
      monto: 350,
      fecha: '2026-05-02',
      motivo: 'Pago de proveedor'
    }
  ];

  registrarMovimiento() {
    if (!this.movimiento.tipo || !this.movimiento.cuenta || !this.movimiento.monto || !this.movimiento.fecha) {
      alert('Complete los campos obligatorios');
      return;
    }

    this.movimientos.unshift({ ...this.movimiento });

    this.movimiento = {
      tipo: '',
      cuenta: '',
      monto: 0,
      fecha: '',
      motivo: ''
    };
  }

  get totalIngresos() {
    return this.movimientos
      .filter(m => m.tipo === 'Depósito')
      .reduce((total, m) => total + Number(m.monto), 0);
  }

  get totalRetiros() {
    return this.movimientos
      .filter(m => m.tipo === 'Retiro')
      .reduce((total, m) => total + Number(m.monto), 0);
  }

  get saldoCaja() {
    return this.totalIngresos - this.totalRetiros;
  }
}
