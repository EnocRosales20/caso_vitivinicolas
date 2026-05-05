import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CuentasBancariasService } from '../../core/services/cuentas-bancarias';

// 👇 AGREGAR ESTA IMPORTACIÓN
import { ChangeDetectorRef } from '@angular/core';

interface Cuenta {
  id?: number;
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
export class Cuentas implements OnInit {
  nuevaCuenta: Cuenta = {
    banco: '',
    tipo: '',
    numero: '',
    saldo: 0,
    estado: 'Activa'
  };

  cuentas: Cuenta[] = [];

  // 👇 MODIFICAR EL CONSTRUCTOR
  constructor(
    private cuentasService: CuentasBancariasService,
    private cdr: ChangeDetectorRef  // 👈 AGREGAR ESTA LÍNEA
  ) {}

  ngOnInit(): void {
    this.cargarCuentasDesdeBackend();
  }

  cargarCuentasDesdeBackend() {
    this.cuentasService.listarTodas().subscribe({
      next: (data: any[]) => {
        this.cuentas = data.map(item => ({
          id: item.id,
          banco: item.nombreBanco,
          tipo: item.tipoCuenta === 'CORRIENTE' ? 'Cuenta Corriente' : 'Cuenta de Ahorro',
          numero: item.numeroCuenta,
          saldo: item.saldo,
          estado: 'Activa'
        }));
        console.log('Cuentas cargadas:', this.cuentas);
        
        // 👇 FORZAR ACTUALIZACIÓN DE LA VISTA
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error al cargar cuentas:', err);
        alert('Error al conectar con el servidor. Asegúrate que el backend esté corriendo.');
      }
    });
  }

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

    this.cuentasService.crear(this.nuevaCuenta).subscribe({
      next: () => {
        this.cargarCuentasDesdeBackend();
        this.nuevaCuenta = {
          banco: '',
          tipo: '',
          numero: '',
          saldo: 0,
          estado: 'Activa'
        };
        alert('Cuenta registrada exitosamente');
        
        // 👇 FORZAR ACTUALIZACIÓN DE LA VISTA
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error al crear cuenta:', err);
        alert('Error al registrar la cuenta en el servidor');
      }
    });
  }

  eliminarCuenta(numero: string) {
    const cuentaAEliminar = this.cuentas.find(c => c.numero === numero);
    
    if (!cuentaAEliminar || !cuentaAEliminar.id) {
      alert('No se pudo identificar la cuenta a eliminar');
      return;
    }

    if (confirm('¿Estás seguro de eliminar esta cuenta?')) {
      this.cuentasService.eliminar(cuentaAEliminar.id).subscribe({
        next: () => {
          this.cargarCuentasDesdeBackend();
          alert('Cuenta eliminada exitosamente');
          
          // 👇 FORZAR ACTUALIZACIÓN DE LA VISTA
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.error('Error al eliminar:', err);
          alert('Error al eliminar la cuenta');
        }
      });
    }
  }
}