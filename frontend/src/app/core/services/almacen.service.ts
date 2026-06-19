import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'; // Importamos el nuevo environment

@Injectable({
  providedIn: 'root'
})
export class AlmacenService {

  // Url para Inventario / Productos (Puerto 8081)
  private apiUrlInventario = environment.inventarioApiUrl;

  // Url para las Guías de Almacén (Puerto 8082)
  private apiUrlGuias = environment.guiasAlmacenApiUrl;

  constructor(private http: HttpClient) {}

  // ==========================================
  // METODOS DE INVENTARIO / PRODUCTOS (Puerto 8081)
  // ==========================================

  listarTodos(): Observable<any> {
    return this.http.get(this.apiUrlInventario);
  }

  actualizarStock(id: number, cantidad: number): Observable<any> {
    return this.http.put(`${this.apiUrlInventario}/${id}/stock`, cantidad);
  }

  filtrarStock(nombre: string, categoria: string, ubicacion: string): Observable<any> {
    let params = new HttpParams();
    
    if (nombre) params = params.set('nombre', nombre);
    if (categoria) params = params.set('categoria', categoria);
    if (ubicacion) params = params.set('ubicacion', ubicacion);

    return this.http.get(`${this.apiUrlInventario}/filtrar`, { params });
  }

  // ==========================================
  // METODOS DE GUIAS DE ALMACEN (Puerto 8082)
  // ==========================================

  listarTodasLasGuias(): Observable<any> {
    return this.http.get(this.apiUrlGuias);
  }

  guardarGuiaAlmacen(guia: any): Observable<any> {
    return this.http.post(this.apiUrlGuias, guia);
  }
}