import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Cuenta {
  banco: string;
  tipo: string;
  numero: string;
  saldo: number;
  estado: string;
}

@Component({
  selector: 'app-cuentas',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './cuentas-bancarias.html',
  styleUrl: './cuentas-bancarias.scss',
})
export class Cuentas {
  nuevaCuenta: Cuenta = {
    banco: '',
    tipo: '',
    numero: '',
    saldo: 0,
    estado: 'Activa'
  };

  cuentas: Cuenta[] = [
    {
      banco: 'BCP',
      tipo: 'Cuenta Corriente',
      numero: '001-456789123',
      saldo: 80000,
      estado: 'Activa'
    },
    {
      banco: 'BBVA',
      tipo: 'Cuenta de Ahorro',
      numero: '002-987654321',
      saldo: 44500,
      estado: 'Pendiente'
    }
  ];

  get saldoGlobal() {
    return this.cuentas.reduce((total, c) => total + Number(c.saldo), 0);
  }

  get pendientes() {
    return this.cuentas.filter(c => c.estado === 'Pendiente').length;
  }

  registrarCuenta() {
    if (!this.nuevaCuenta.banco || !this.nuevaCuenta.tipo || !this.nuevaCuenta.numero) {
      alert('Complete los campos obligatorios');
      return;
    }

    this.cuentas.unshift({ ...this.nuevaCuenta });

    this.nuevaCuenta = {
      banco: '',
      tipo: '',
      numero: '',
      saldo: 0,
      estado: 'Activa'
    };
  }

  eliminarCuenta(numero: string) {
    this.cuentas = this.cuentas.filter(c => c.numero !== numero);
  }
}
