import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface GuiaAlmacenBackend {
  id?: number;
  nroGuia: string;
  tipoMovemento?: string; // Por si acaso viaja así
  tipoMovimiento: string;  // "Ingreso", "Salida", "Compra", etc.
  encargado: string;       // Aquí viaja la cantidad como String
  motivo: string;          // Aquí viaja el texto parseado (Prod:, Cat:, etc.)
}

@Injectable({
  providedIn: 'root'
})
export class GuiasAlmacenService {
  
  private apiUrl = 'http://localhost:8082/api/guias-almacen';

  constructor(private http: HttpClient) {}

  // ALINEADO CON @GetMapping
  listar(): Observable<GuiaAlmacenBackend[]> {
    return this.http.get<GuiaAlmacenBackend[]>(this.apiUrl);
  }

  // ALINEADO CON @PostMapping (crearGuia)
  crear(guia: GuiaAlmacenBackend): Observable<GuiaAlmacenBackend> {
    return this.http.post<GuiaAlmacenBackend>(this.apiUrl, guia);
  }

  // ALINEADO CON @DeleteMapping
  eliminar(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' });
  }
}