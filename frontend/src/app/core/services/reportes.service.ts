import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Reporte {
  id?: number;
  codigo: string;
  tipo: string;
  periodo: string;
  responsable: string;
  estado: string;
  fecha: string;
  contenido?: string;
  totalIngresos?: number;
  totalEgresos?: number;
  saldoFinal?: number;
  totalProductos?: number;
  productosCriticos?: number;
  totalCuentas?: number;
  saldoTotalCuentas?: number;
  totalGuias?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReportesService {
  // CAMBIADO: apunta al microservicio de reportes (puerto 8083)
  private apiUrl = `${environment.apiReportes}/reportes`;

  constructor(private http: HttpClient) { }

  generarReporte(tipo: string, responsable: string): Observable<Reporte> {
    return this.http.post<Reporte>(`${this.apiUrl}/generar/${tipo}?responsable=${responsable}`, {});
  }

  obtenerTodos(): Observable<Reporte[]> {
    return this.http.get<Reporte[]>(this.apiUrl);
  }

  eliminarReporte(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}