import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReportesService, Reporte } from './reportes.service';

// Bloque de pruebas unitarias para el servicio de Reportes
describe('ReportesService', () => {
  let service: ReportesService;           
  let httpMock: HttpTestingController;   
  const apiUrl = 'http://localhost:8080/api/reportes';  

  
  // CONFIGURACIÓN INICIAL - Se ejecuta antes de cada prueba
  
  beforeEach(() => {
    // Configura el módulo de pruebas con HttpClient mockeado
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],     // Importa módulo para pruebas HTTP
      providers: [ReportesService]           // Declara el servicio a probar
    });
    service = TestBed.inject(ReportesService);     // Obtiene instancia del servicio
    httpMock = TestBed.inject(HttpTestingController); // Obtiene controlador HTTP mock
  });

  
  // LIMPIEZA - Se ejecuta después de cada prueba
 
  afterEach(() => {
    httpMock.verify();  // Verifica que no queden peticiones HTTP pendientes
  });

  
  // CP-RP-GEN-01: Generar reporte de CAJA
  
  it('CP-RP-GEN-01: debe generar un reporte de caja', () => {
    // ESCENARIO: Datos mock del reporte de caja esperado
    const mockReporte: Reporte = {
      codigo: 'R001',
      tipo: 'Caja',
      periodo: 'Junio 2026',
      responsable: 'Administrador',
      estado: 'Generado',
      fecha: '2026-06-10',
      totalIngresos: 1500,   // Total de ingresos del periodo
      totalEgresos: 300,     // Total de egresos del periodo
      saldoFinal: 1200       // Saldo final = ingresos - egresos
    };

    // ACCION: Generar reporte de caja
    service.generarReporte('Caja', 'Administrador').subscribe(reporte => {
      // VERIFICACIÓN: Validar datos del reporte generado
      expect(reporte.tipo).toBe('Caja');
      expect(reporte.responsable).toBe('Administrador');
      expect(reporte.totalIngresos).toBe(1500);
    });

    // VERIFICACIÓN HTTP: Validar petición POST con parámetros en URL
    const req = httpMock.expectOne(`${apiUrl}/generar/Caja?responsable=Administrador`);
    expect(req.request.method).toBe('POST'); 
    req.flush(mockReporte);  
  });

  
  // CP-RP-GEN-01: Generar reporte de ALMACEN
 
  it('CP-RP-GEN-01: debe generar un reporte de almacén', () => {
    // ESCENARIO: Datos mock del reporte de almacén esperado
    const mockReporte: Reporte = {
      codigo: 'R002',
      tipo: 'Almacen',
      periodo: 'Junio 2026',
      responsable: 'Jefe de almacén',
      estado: 'Generado',
      fecha: '2026-06-10',
      totalProductos: 100,      // Cantidad total de productos
      productosCriticos: 15     // Productos con stock bajo
    };

    // ACCION: Generar reporte de almacén
    service.generarReporte('Almacen', 'Jefe de almacén').subscribe(reporte => {
      // VERIFICACION: Validar datos específicos del almacén
      expect(reporte.tipo).toBe('Almacen');
      expect(reporte.totalProductos).toBe(100);
    });

    // VERIFICACION HTTP: Validar petición POST con responsable como query param
    const req = httpMock.expectOne(`${apiUrl}/generar/Almacen?responsable=Jefe de almacén`);
    expect(req.request.method).toBe('POST');
    req.flush(mockReporte);
  });

  
  // CP-RP-GEN-01: Generar reporte de CUENTAS
  
  it('CP-RP-GEN-01: debe generar un reporte de cuentas', () => {
    // ESCENARIO: Datos mock del reporte de cuentas bancarias
    const mockReporte: Reporte = {
      codigo: 'R003',
      tipo: 'Cuentas',
      periodo: 'Junio 2026',
      responsable: 'Dueño',
      estado: 'Generado',
      fecha: '2026-06-10',
      totalCuentas: 2,              
      saldoTotalCuentas: 124500     
    };

    // ACCION: Generar reporte de cuentas bancarias
    service.generarReporte('Cuentas', 'Dueño').subscribe(reporte => {
      // VERIFICACION: Validar datos financieros consolidados
      expect(reporte.tipo).toBe('Cuentas');
      expect(reporte.totalCuentas).toBe(2);
    });

    // VERIFICACION HTTP: Validar petición POST
    const req = httpMock.expectOne(`${apiUrl}/generar/Cuentas?responsable=Dueño`);
    expect(req.request.method).toBe('POST');
    req.flush(mockReporte);
  });

 
  // CP-RP-GEN-01: Listar todos los reportes generados
  
  it('CP-RP-GEN-01: debe obtener todos los reportes', () => {
    // ESCENARIO: Lista de reportes generados anteriormente
    const mockReportes: Reporte[] = [
      { codigo: 'R001', tipo: 'Caja', periodo: 'Junio 2026', responsable: 'Admin', estado: 'Generado', fecha: '2026-06-10' },
      { codigo: 'R002', tipo: 'Almacen', periodo: 'Junio 2026', responsable: 'Admin', estado: 'Generado', fecha: '2026-06-10' },
      { codigo: 'R003', tipo: 'Caja', periodo: 'Junio 2026', responsable: 'Admin', estado: 'Generado', fecha: '2026-06-10' }
    ];

    // ACCION: Obtener todos los reportes del sistema
    service.obtenerTodos().subscribe(reportes => {
      // VERIFICACION: Validar listado completo y filtrado por tipo
      expect(reportes.length).toBe(3);                     // Total de reportes
      const reportesCaja = reportes.filter(r => r.tipo === 'Caja');
      expect(reportesCaja.length).toBe(2);                 // Filtro de reportes de caja
    });

    // VERIFICACION HTTP: Validar petición GET
    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockReportes);  // Simula respuesta con todos los reportes
  });

 
  // TEST ADICIONAL: Eliminar reporte por ID
 
  it('debe eliminar un reporte por ID', () => {
    // ESCENARIO: ID del reporte a eliminar
    const id = 1;

    // ACCIÓN: Eliminar reporte específico
    service.eliminarReporte(id).subscribe();

    // VERIFICACIÓN HTTP: Validar petición DELETE
    const req = httpMock.expectOne(`${apiUrl}/${id}`);
    expect(req.request.method).toBe('DELETE');  // Método correcto?
    req.flush(null);  // Simula respuesta exitosa sin contenido
  });
});