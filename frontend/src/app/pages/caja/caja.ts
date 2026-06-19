import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { CajaService, MovimientoCaja } from '../../core/services/caja';

@Component({
  selector: 'app-caja',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './caja.html',
  styleUrl: './caja.scss',
})
export class CajaComponent implements OnInit {

  movimientos: MovimientoCaja[] = [];

  movimiento: MovimientoCaja = {
    tipo: 'Depósito',  // 👈 CAMBIADO: valor por defecto
    cuenta: '',
    monto: 0,
    fecha: '',
    motivo: ''
  };

  editando = false;
  idEditando?: number;

  totalIngresos = 0;
  totalRetiros = 0;
  saldoCaja = 0;

  // 👈 NUEVO: para mostrar loading y errores
  isLoading = false;
  errorMessage = '';

  constructor(private cajaService: CajaService) {}

  ngOnInit(): void {
    this.cargarMovimientos();
  }

  cargarMovimientos(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    console.log('🔄 Cargando movimientos...');  // 👈 LOG

    this.cajaService.listarMovimientos().subscribe({
      next: (data) => {
        console.log('✅ Movimientos recibidos:', data);  // 👈 LOG
        this.movimientos = data;
        this.calcularTotales();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('❌ Error al cargar movimientos:', err);  // 👈 LOG
        this.errorMessage = 'Error al cargar movimientos. Verifica que el backend esté corriendo.';
        this.isLoading = false;
        alert('Error al cargar movimientos. Revisa la consola (F12) para más detalles.');
      }
    });
  }

  calcularTotales(): void {
    this.totalIngresos = this.movimientos
      .filter(m => m.tipo === 'Depósito')
      .reduce((sum, m) => sum + Number(m.monto), 0);

    this.totalRetiros = this.movimientos
      .filter(m => m.tipo === 'Retiro')
      .reduce((sum, m) => sum + Number(m.monto), 0);

    this.saldoCaja = this.totalIngresos - this.totalRetiros;

    console.log('📊 Totales calculados:', {  // 👈 LOG
      totalIngresos: this.totalIngresos,
      totalRetiros: this.totalRetiros,
      saldoCaja: this.saldoCaja
    });
  }

  registrarMovimiento(): void {
    if (
      !this.movimiento.tipo ||
      !this.movimiento.cuenta ||
      !this.movimiento.monto ||
      !this.movimiento.fecha ||
      !this.movimiento.motivo
    ) {
      alert('Complete todos los campos');
      return;
    }

    if (this.editando && this.idEditando) {
      this.actualizarMovimiento();
      return;
    }

    console.log('📝 Registrando movimiento:', this.movimiento);  // 👈 LOG

    this.cajaService.registrarMovimiento(this.movimiento).subscribe({
      next: (response) => {
        console.log('✅ Movimiento creado:', response);  // 👈 LOG
        alert('Movimiento registrado correctamente');
        this.limpiarFormulario();
        this.cargarMovimientos();
      },
      error: (err) => {
        console.error('❌ Error al registrar:', err);  // 👈 LOG
        alert('Error al registrar movimiento. Revisa la consola (F12).');
      }
    });
  }

  seleccionarMovimiento(item: MovimientoCaja): void {
    this.editando = true;
    this.idEditando = item.id;

    this.movimiento = {
      tipo: item.tipo,
      cuenta: item.cuenta,
      monto: item.monto,
      fecha: item.fecha,
      motivo: item.motivo
    };
  }

  actualizarMovimiento(): void {
    if (!this.idEditando) return;

    console.log('📝 Actualizando movimiento:', this.idEditando, this.movimiento);  // 👈 LOG

    this.cajaService.actualizarMovimiento(
      this.idEditando,
      this.movimiento
    ).subscribe({
      next: () => {
        console.log('✅ Movimiento actualizado');  // 👈 LOG
        alert('Movimiento actualizado correctamente');
        this.limpiarFormulario();
        this.cargarMovimientos();
      },
      error: (err) => {
        console.error('❌ Error al actualizar:', err);  // 👈 LOG
        alert('Error al actualizar movimiento');
      }
    });
  }

  eliminarMovimiento(id?: number): void {
    if (!id) return;

    const confirmar = confirm('¿Seguro que deseas eliminar este movimiento?');
    if (!confirmar) return;

    console.log('🗑️ Eliminando movimiento:', id);  // 👈 LOG

    this.cajaService.eliminarMovimiento(id).subscribe({
      next: () => {
        console.log('✅ Movimiento eliminado');  // 👈 LOG
        alert('Movimiento eliminado');
        this.cargarMovimientos();
      },
      error: (err) => {
        console.error('❌ Error al eliminar:', err);  // 👈 LOG
        alert('Error al eliminar movimiento');
      }
    });
  }

  limpiarFormulario(): void {
    this.movimiento = {
      tipo: 'Depósito',  // 👈 CAMBIADO: valor por defecto
      cuenta: '',
      monto: 0,
      fecha: '',
      motivo: ''
    };

    this.editando = false;
    this.idEditando = undefined;
  }
}