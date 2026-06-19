import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface CuentaBancaria {
  id?: number;
  nombreBanco: string;
  numeroCuenta: string;
  tipoCuenta: string;
  saldo: number;
  moneda: string;
  fechaApertura: string;
  titular: string;
}

@Injectable({
  providedIn: 'root'
})
export class CuentasBancariasService {
  // CAMBIADO: apunta al microservicio de cuentas (puerto 8082)
  private apiUrl = `${environment.apiCuentas}/cuentas`;

  constructor(private http: HttpClient) {}

  listarTodas(): Observable<CuentaBancaria[]> {
    return this.http.get<CuentaBancaria[]>(this.apiUrl);
  }

  crear(cuenta: any): Observable<CuentaBancaria> {
    const cuentaBackend = {
      nombreBanco: cuenta.banco,
      numeroCuenta: cuenta.numero,
      tipoCuenta: cuenta.tipo === 'Cuenta Corriente' ? 'CORRIENTE' : 'AHORRO',
      saldo: cuenta.saldo,
      moneda: 'CLP',
      fechaApertura: new Date().toISOString().split('T')[0],
      titular: 'Empresa Vitivinícola'
    };
    return this.http.post<CuentaBancaria>(this.apiUrl, cuentaBackend);
  }

  actualizar(id: number, cuenta: any): Observable<CuentaBancaria> {
    const cuentaBackend = {
      nombreBanco: cuenta.banco,
      numeroCuenta: cuenta.numero,
      tipoCuenta: cuenta.tipo === 'Cuenta Corriente' ? 'CORRIENTE' : 'AHORRO',
      saldo: cuenta.saldo,
      moneda: 'CLP',
      fechaApertura: new Date().toISOString().split('T')[0],
      titular: 'Empresa Vitivinícola'
    };
    return this.http.put<CuentaBancaria>(`${this.apiUrl}/${id}`, cuentaBackend);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  obtenerPorId(id: number): Observable<CuentaBancaria> {
    return this.http.get<CuentaBancaria>(`${this.apiUrl}/${id}`);
  }
}