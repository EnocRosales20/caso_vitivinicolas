import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlmacenService {

  private apiUrl = 'http://localhost:8080/productos';

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  actualizarStock(id: number, cantidad: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/stock`, cantidad);
  }

  filtrarStock(nombre: string, categoria: string, ubicacion: string): Observable<any> {
    // Construimos los parámetros de forma limpia
    let params = new HttpParams();
    
    if (nombre) params = params.set('nombre', nombre);
    if (categoria) params = params.set('categoria', categoria);
    if (ubicacion) params = params.set('ubicacion', ubicacion);

    // Angular codifica automáticamente los espacios y caracteres especiales
    return this.http.get(`${this.apiUrl}/filtrar`, { params });
  }
}