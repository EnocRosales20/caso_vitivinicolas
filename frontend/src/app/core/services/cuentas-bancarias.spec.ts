import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CuentasBancariasService } from './cuentas-bancarias';

// Bloque de pruebas unitarias para el servicio de Cuentas Bancarias
describe('CuentasBancariasService', () => {
  let service: CuentasBancariasService;      // Servicio real a probar
  let httpMock: HttpTestingController;       // Mock de peticiones HTTP
  const apiUrl = 'http://localhost:8080/cuentas-bancarias';  // URL base de la API

  
  // CONFIGURACIÓN INICIAL 
 
  beforeEach(() => {
    // Configura el módulo de pruebas con HttpClient mockeado
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],          
      providers: [CuentasBancariasService]        
    });
    service = TestBed.inject(CuentasBancariasService);  
    httpMock = TestBed.inject(HttpTestingController);   
  });

  
  // LIMPIEZA - Se ejecuta después de cada prueba
  
  afterEach(() => {
    httpMock.verify();  // Verifica que no queden peticiones HTTP pendientes
  });

  
  // CP-CB-REG-01: Validar registro de cuenta bancaria
 
  it('CP-CB-REG-01: debe registrar una cuenta bancaria transformando los datos correctamente', () => {
    // ESCENARIO: Datos de cuenta en formato del frontend
    const cuentaFrontend = {
      banco: 'BCP',
      tipo: 'Cuenta Corriente',
      numero: '001-456789123',
      saldo: 80000,
      estado: 'Activa'
    };

    // ESCENARIO: Datos esperados en formato del backend después de transformación
    const cuentaBackendEsperado = {
      nombreBanco: 'BCP',
      numeroCuenta: '001-456789123',
      tipoCuenta: 'CORRIENTE',           // Transformado a mayúsculas
      saldo: 80000,
      moneda: 'CLP',                     // Moneda por defecto
      fechaApertura: new Date().toISOString().split('T')[0],  // Fecha actual
      titular: 'Empresa Vitivinícola'    // Titular por defecto
    };

    // ACCION: Llamar al servicio para crear la cuenta
    service.crear(cuentaFrontend).subscribe(response => {
      // VERIFICACION: Validar que hubo respuesta del servidor
      expect(response).toBeTruthy();
    });

    // VERIFICACIÓN HTTP: Validar la petición HTTP enviada
    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');       
    // Validar transformación de nombre de banco
    expect(req.request.body.nombreBanco).toEqual(cuentaBackendEsperado.nombreBanco);
    // Validar transformación de tipo de cuenta a mayúsculas
    expect(req.request.body.tipoCuenta).toEqual('CORRIENTE');
    req.flush({});  // Simula respuesta exitosa del servidor
  });

  
  // TEST ADICIONAL: Listar todas las cuentas bancarias
  
  it('debe listar todas las cuentas bancarias', () => {
    // ESCENARIO: Lista mock de cuentas bancarias
    const mockCuentas = [
      { id: 1, nombreBanco: 'BCP', tipoCuenta: 'CORRIENTE', numeroCuenta: '001-123', saldo: 80000 },
      { id: 2, nombreBanco: 'BBVA', tipoCuenta: 'AHORRO', numeroCuenta: '002-456', saldo: 44500 }
    ];

    // ACCION: Obtener todas las cuentas del servicio
    service.listarTodas().subscribe(cuentas => {
      // VERIFICACIÓN: Validar cantidad y datos de cuentas
      expect(cuentas.length).toBe(2);               // Dos cuentas?
      expect(cuentas[0].nombreBanco).toBe('BCP');   // Primera cuenta es BCP?
    });

    // VERIFICACIÓN HTTP: Validar petición GET
    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');   
    req.flush(mockCuentas);                   
  });

  
  // TEST ADICIONAL: Eliminar cuenta bancaria
  
  it('debe eliminar una cuenta bancaria por ID', () => {
    // ESCENARIO: ID de la cuenta a eliminar
    const id = 1;

    // ACCION: Llamar al servicio para eliminar la cuenta
    service.eliminar(id).subscribe();

    // VERIFICACION HTTP: Validar petición DELETE
    const req = httpMock.expectOne(`${apiUrl}/${id}`);
    expect(req.request.method).toBe('DELETE');  
    req.flush(null); 
  });
});