import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface MovimientoCaja {
  id?: number;
  tipo: string;      // "INGRESO" o "EGRESO"
  cuenta: string;
  monto: number;
  fecha: string;
  motivo: string;
}

@Injectable({
  providedIn: 'root',
})
export class CajaService {
  // CAMBIADO: apunta al microservicio de caja (puerto 8081)
  private apiUrl = `${environment.apiCaja}/caja`;

  constructor(private http: HttpClient) {}

  listarMovimientos(): Observable<MovimientoCaja[]> {
    return this.http.get<MovimientoCaja[]>(this.apiUrl);
  }

  registrarMovimiento(movimiento: MovimientoCaja): Observable<MovimientoCaja> {
    return this.http.post<MovimientoCaja>(this.apiUrl, movimiento);
  }

  actualizarMovimiento(id: number, movimiento: MovimientoCaja): Observable<MovimientoCaja> {
    return this.http.put<MovimientoCaja>(`${this.apiUrl}/${id}`, movimiento);
  }

  eliminarMovimiento(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // NUEVO: Obtener saldo actual
  getSaldo(): Observable<{ saldo: number }> {
    return this.http.get<{ saldo: number }>(`${this.apiUrl}/saldo`);
  }
}