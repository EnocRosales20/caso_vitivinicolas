import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CuentasBancariasService {

  private apiUrl = 'http://localhost:8080/cuentas-bancarias';

  constructor(private http: HttpClient) {}

  listarTodas(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  crear(cuenta: any): Observable<any> {
    const cuentaBackend = {
      nombreBanco: cuenta.banco,
      numeroCuenta: cuenta.numero,
      tipoCuenta: cuenta.tipo === 'Cuenta Corriente' ? 'CORRIENTE' : 'AHORRO',
      saldo: cuenta.saldo,
      moneda: 'CLP',
      fechaApertura: new Date().toISOString().split('T')[0],
      titular: 'Empresa Vitivinícola'
    };
    return this.http.post(this.apiUrl, cuentaBackend);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}