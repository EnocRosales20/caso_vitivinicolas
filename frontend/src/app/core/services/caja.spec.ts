import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CajaService, MovimientoCaja } from './caja';

// Bloque de pruebas unitarias para el servicio de Caja
describe('CajaService', () => {
  let service: CajaService;           // Servicio real a probar
  let httpMock: HttpTestingController; // Mock de peticiones HTTP
  const apiUrl = 'http://localhost:8080/caja';  // URL base de la API

 
  // CONFIGURACIÓN INICIAL - Se ejecuta antes de cada prueba
  
  beforeEach(() => {
    // Configura el modulo de pruebas con HttpClient mockeado
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],  // Importa módulo para pruebas HTTP
      providers: [CajaService]             // Declara el servicio a probar
    });
    service = TestBed.inject(CajaService);     // Obtiene instancia del servicio
    httpMock = TestBed.inject(HttpTestingController); // Obtiene controlador HTTP mock
  });

  
  // LIMPIEZA - Se ejecuta después de cada prueba
  
  afterEach(() => {
    httpMock.verify();  // Verifica que no queden peticiones HTTP pendientes
  });

  
  // CP-CJ-REG-01: Validar registro de movimiento de caja
  
  it('CP-CJ-REG-01: debe registrar un movimiento de caja vía POST', () => {
    // ESCENARIO: Crear un movimiento de caja de prueba
    const mockMovimiento: MovimientoCaja = {
      tipo: 'Depósito',
      cuenta: 'Caja Principal',
      monto: 1000,
      fecha: '2026-06-10',
      motivo: 'Prueba de registro'
    };

    // ACCIÓN: Llamar al servicio para registrar el movimiento
    service.registrarMovimiento(mockMovimiento).subscribe(response => {
      // VERIFICACIÓN: Validar que la respuesta coincide con el envio
      expect(response).toEqual(mockMovimiento);
    });

    // VERIFICACIÓN HTTP: Validar la petición HTTP enviada
    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');        
    expect(req.request.body).toEqual(mockMovimiento); 
    req.flush(mockMovimiento);
  });

  
  // CP-CJ-CAL-01: Validar cálculo de ingresos, retiros y saldo
  
  it('CP-CJ-CAL-01: debe listar movimientos y calcular totales correctamente', () => {
    // ESCENARIO: Crear lista de movimientos mixtos (depósitos y retiros)
    const mockMovimientos: MovimientoCaja[] = [
      { tipo: 'Depósito', cuenta: 'Caja Principal', monto: 1000, fecha: '2026-06-10', motivo: 'Venta' },
      { tipo: 'Depósito', cuenta: 'Caja Principal', monto: 500, fecha: '2026-06-10', motivo: 'Venta' },
      { tipo: 'Retiro', cuenta: 'Caja Principal', monto: 300, fecha: '2026-06-10', motivo: 'Compra' }
    ];

    // ACCIÓN: Obtener lista de movimientos y calcular totales
    service.listarMovimientos().subscribe(movimientos => {
      // Calculo de ingresos (suma de todos los depósitos)
      const ingresos = movimientos.filter(m => m.tipo === 'Depósito').reduce((sum, m) => sum + m.monto, 0);
      // Calculo de retiros (suma de todos los retiros)
      const retiros = movimientos.filter(m => m.tipo === 'Retiro').reduce((sum, m) => sum + m.monto, 0);
      
      // VERIFICACIÓN: Validar calculos matemáticos
      expect(ingresos).toBe(1500);        // 1000 + 500 = 1500
      expect(retiros).toBe(300);          // 300 = 300
      expect(ingresos - retiros).toBe(1200); // Saldo final = 1500 - 300
    });

    // VERIFICACIÓN HTTP: Validar petición GET
    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockMovimientos);  // Simula respuesta con los movimientos
  });

  
  // TEST ADICIONAL: Actualizar movimiento existente
  
  it('debe actualizar un movimiento existente vía PUT', () => {
    // ESCENARIO: Datos del movimiento a actualizar
    const id = 1;  // ID del movimiento existente
    const mockMovimiento: MovimientoCaja = {
      tipo: 'Depósito',
      cuenta: 'Caja Principal',
      monto: 2000,
      fecha: '2026-06-10',
      motivo: 'Actualizado'
    };

    // ACCIÓN: Llamar al servicio de actualización
    service.actualizarMovimiento(id, mockMovimiento).subscribe(response => {
      // VERIFICACIÓN: Validar respuesta del servidor
      expect(response).toEqual(mockMovimiento);
    });

    // VERIFICACIÓN HTTP: Validar petición PUT
    const req = httpMock.expectOne(`${apiUrl}/${id}`);
    expect(req.request.method).toBe('PUT');       
    expect(req.request.body).toEqual(mockMovimiento); 
    req.flush(mockMovimiento);  
  });

  
  // TEST ADICIONAL: Eliminar movimiento
  
  it('debe eliminar un movimiento vía DELETE', () => {
    // ESCENARIO: ID del movimiento a eliminar
    const id = 1;

    // ACCIÓN: Llamar al servicio de eliminación
    service.eliminarMovimiento(id).subscribe();

    // VERIFICACIÓN HTTP: Validar petición DELETE
    const req = httpMock.expectOne(`${apiUrl}/${id}`);
    expect(req.request.method).toBe('DELETE');  
    req.flush(null);  
  });
});