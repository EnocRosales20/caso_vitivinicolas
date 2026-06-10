import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';  
import { of } from 'rxjs';
import { vi } from 'vitest';  
import { CajaComponent } from './caja';
import { CajaService, MovimientoCaja } from '../../core/services/caja';

// Bloque de pruebas unitarias para el componente CajaComponent
describe('CajaComponent', () => {
  let component: CajaComponent;           // Componente real a probar
  let fixture: ComponentFixture<CajaComponent>;  // Fixture para pruebas del componente
  let cajaService: CajaService;           // Servicio mockeado

  // Datos mock de movimientos para las pruebas
  const mockMovimientos: MovimientoCaja[] = [
    { id: 1, tipo: 'Depósito', cuenta: 'Caja Principal', monto: 1000, fecha: '2026-06-10', motivo: 'Venta' },
    { id: 2, tipo: 'Depósito', cuenta: 'Caja Principal', monto: 500, fecha: '2026-06-10', motivo: 'Venta' },
    { id: 3, tipo: 'Retiro', cuenta: 'Caja Principal', monto: 300, fecha: '2026-06-10', motivo: 'Compra' }
  ];

  
  // CONFIGURACIÓN INICIAL - Se ejecuta antes de todas las pruebas
  
  beforeEach(async () => {
    // Configura el modulo de pruebas
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,  // Para peticiones HTTP mockeadas
        CajaComponent            // Componente standalone a probar
      ],
      providers: [
        CajaService,              // Servicio real (luego se mockean métodos)
        provideRouter([])        // Router vacío para evitar errores
      ]
    }).compileComponents();  // Compila el componente y templates

    // Crea instancias del componente y servicios
    fixture = TestBed.createComponent(CajaComponent);
    component = fixture.componentInstance;
    cajaService = TestBed.inject(CajaService);
  });

 
  // CP-CJ-CAL-01: Validar cálculo de ingresos, retiros y saldo
  
  describe('CP-CJ-CAL-01 - Cálculo de ingresos, retiros y saldo', () => {
    // Configuración previa a cada prueba de este grupo
    beforeEach(() => {
      // Simula que el servicio devuelve los movimientos mockeados
      vi.spyOn(cajaService, 'listarMovimientos').mockReturnValue(of(mockMovimientos));
      fixture.detectChanges();  // Detecta cambios y ejecuta ngOnInit
    });

    // Prueba: Verifica cálculos al cargar movimientos iniciales
    it('debe calcular correctamente los totales al cargar movimientos', () => {
      expect(component.totalIngresos).toBe(1500);  // 1000 + 500 = 1500
      expect(component.totalRetiros).toBe(300);     // 300
      expect(component.saldoCaja).toBe(1200);       // 1500 - 300 = 1200
    });

    // Prueba: Verifica recálculo después de agregar nuevo movimiento
    it('debe recalcular totales después de agregar un movimiento', () => {
      // ESCENARIO: Nuevo movimiento de 200
      const nuevoMovimiento: MovimientoCaja = {
        tipo: 'Depósito', cuenta: 'Caja Principal', monto: 200, fecha: '2026-06-10', motivo: 'Extra'
      };
      
      // ACCION: Agregar a la lista y recalcular
      component.movimientos = [...mockMovimientos, { ...nuevoMovimiento, id: 4 }];
      component.calcularTotales();
      
      // VERIFICACIÓN: Totales actualizados correctamente
      expect(component.totalIngresos).toBe(1700);  // 1500 + 200 = 1700
      expect(component.saldoCaja).toBe(1400);      // 1700 - 300 = 1400
    });
  });

 
  // CP-CJ-REG-01: Validar registro de movimiento
  
  describe('CP-CJ-REG-01 - Registro de movimiento', () => {
    // Configuración: Lista de movimientos vacía inicialmente
    beforeEach(() => {
      vi.spyOn(cajaService, 'listarMovimientos').mockReturnValue(of([]));
      fixture.detectChanges();
    });

    // Prueba: Validación de campos obligatorios
    it('debe validar que todos los campos sean obligatorios', () => {
      // ESCENARIO: Movimiento vacío sin datos
      component.movimiento = { tipo: '', cuenta: '', monto: 0, fecha: '', motivo: '' };
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
      
      // ACCION: Intentar registrar movimiento vacío
      component.registrarMovimiento();
      
      // VERIFICACION: Mostrar alerta de campos incompletos
      expect(alertSpy).toHaveBeenCalledWith('Complete todos los campos');
    });

    // Prueba: Registro exitoso de movimiento
    it('debe registrar un movimiento exitosamente', () => {
      // ESCENARIO: Movimiento con datos válidos
      component.movimiento = {
        tipo: 'Depósito', cuenta: 'Caja Principal', monto: 1000, fecha: '2026-06-10', motivo: 'Prueba'
      };
      // Simular respuestas exitosas del servicio
      vi.spyOn(cajaService, 'registrarMovimiento').mockReturnValue(of(component.movimiento));
      vi.spyOn(cajaService, 'listarMovimientos').mockReturnValue(of([]));
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
      
      // ACCION: Registrar movimiento
      component.registrarMovimiento();
      
      // VERIFICACION: Servicio llamado y alerta de éxito
      expect(cajaService.registrarMovimiento).toHaveBeenCalled();
      expect(alertSpy).toHaveBeenCalledWith('Movimiento registrado correctamente');
    });
  });

  
  // TEST ADICIONAL: Eliminar movimiento
 
  describe('Eliminación de movimientos', () => {
    // Configuración: Cargar lista de movimientos mockeados
    beforeEach(() => {
      vi.spyOn(cajaService, 'listarMovimientos').mockReturnValue(of(mockMovimientos));
      fixture.detectChanges();
    });

    // Prueba: Eliminar movimiento exitosamente
    it('debe eliminar un movimiento exitosamente', () => {
      // Simular eliminación exitosa
      vi.spyOn(cajaService, 'eliminarMovimiento').mockReturnValue(of(void 0));
      vi.spyOn(cajaService, 'listarMovimientos').mockReturnValue(of([]));
      vi.spyOn(window, 'confirm').mockReturnValue(true);  // Usuario confirma eliminación
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
      
      // ACCION: Eliminar movimiento con ID 1
      component.eliminarMovimiento(1);
      
      // VERIFICACION: Servicio llamado y alerta de éxito
      expect(cajaService.eliminarMovimiento).toHaveBeenCalledWith(1);
      expect(alertSpy).toHaveBeenCalledWith('Movimiento eliminado');
    });
  });
});