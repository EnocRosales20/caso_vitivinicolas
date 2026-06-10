import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';  // ← CAMBIAR
import { of } from 'rxjs';
import { vi } from 'vitest';
import { Reportes } from './reportes';
import { ReportesService, Reporte } from '../../core/services/reportes.service';

describe('ReportesComponent', () => {
  let component: Reportes;
  let fixture: ComponentFixture<Reportes>;
  let reportesService: ReportesService;

  const mockReportes: Reporte[] = [
    { codigo: 'R001', tipo: 'Caja', periodo: 'Junio 2026', responsable: 'Admin', estado: 'Generado', fecha: '2026-06-10' },
    { codigo: 'R002', tipo: 'Almacen', periodo: 'Junio 2026', responsable: 'Admin', estado: 'Generado', fecha: '2026-06-10' },
    { codigo: 'R003', tipo: 'Caja', periodo: 'Junio 2026', responsable: 'Admin', estado: 'Generado', fecha: '2026-06-10' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        Reportes
      ],
      providers: [
        ReportesService,
        provideRouter([])  // ← AGREGAR: rutas vacías
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Reportes);
    component = fixture.componentInstance;
    reportesService = TestBed.inject(ReportesService);
  });

  // ==========================================
  // CP-RP-GEN-01: Validar listado de reportes
  // ==========================================
  describe('CP-RP-GEN-01 - Listado de reportes', () => {
    beforeEach(() => {
      vi.spyOn(reportesService, 'obtenerTodos').mockReturnValue(of(mockReportes));
      fixture.detectChanges();
    });

    it('debe cargar los reportes correctamente al iniciar', () => {
      expect(component.reportes.length).toBe(3);
      expect(component.totalReportes).toBe(3);
    });
  });

  // ==========================================
  // CP-RP-GEN-01: Validar filtrado por tipo
  // ==========================================
  describe('CP-RP-GEN-01 - Filtrado de reportes', () => {
    beforeEach(() => {
      vi.spyOn(reportesService, 'obtenerTodos').mockReturnValue(of(mockReportes));
      fixture.detectChanges();
    });

    it('debe filtrar reportes por tipo CAJA', () => {
      component.filtroTipo = 'Caja';
      component.aplicarFiltro();
      
      expect(component.reportesFiltrados.length).toBe(2);
      expect(component.reportesFiltrados[0].tipo).toBe('Caja');
    });

    it('debe filtrar reportes por tipo ALMACEN', () => {
      component.filtroTipo = 'Almacen';
      component.aplicarFiltro();
      
      expect(component.reportesFiltrados.length).toBe(1);
      expect(component.reportesFiltrados[0].tipo).toBe('Almacen');
    });

    it('debe mostrar todos los reportes cuando el filtro está vacío', () => {
      component.filtroTipo = '';
      component.aplicarFiltro();
      
      expect(component.reportesFiltrados.length).toBe(3);
    });
  });

  // ==========================================
  // CP-RP-GEN-01: Validar generación de reportes
  // ==========================================
  describe('CP-RP-GEN-01 - Generación de reportes', () => {
    beforeEach(() => {
      vi.spyOn(reportesService, 'obtenerTodos').mockReturnValue(of([]));
      fixture.detectChanges();
    });

    it('debe generar un reporte de caja exitosamente', () => {
      const nuevoReporte: Reporte = { 
        codigo: 'R004', 
        tipo: 'Caja', 
        periodo: 'Junio 2026', 
        responsable: 'Administrador', 
        estado: 'Generado', 
        fecha: '2026-06-10' 
      };
      vi.spyOn(reportesService, 'generarReporte').mockReturnValue(of(nuevoReporte));
      vi.spyOn(reportesService, 'obtenerTodos').mockReturnValue(of([...mockReportes, nuevoReporte]));
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
      
      component.generarReporte('Caja');
      
      expect(reportesService.generarReporte).toHaveBeenCalledWith('Caja', 'Administrador');
      expect(alertSpy).toHaveBeenCalledWith('Reporte de Caja generado exitosamente');
    });

    it('debe generar un reporte de almacén exitosamente', () => {
      const nuevoReporte: Reporte = { 
        codigo: 'R005', 
        tipo: 'Almacen', 
        periodo: 'Junio 2026', 
        responsable: 'Administrador', 
        estado: 'Generado', 
        fecha: '2026-06-10' 
      };
      vi.spyOn(reportesService, 'generarReporte').mockReturnValue(of(nuevoReporte));
      vi.spyOn(reportesService, 'obtenerTodos').mockReturnValue(of([...mockReportes, nuevoReporte]));
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
      
      component.generarReporte('Almacen');
      
      expect(reportesService.generarReporte).toHaveBeenCalledWith('Almacen', 'Administrador');
      expect(alertSpy).toHaveBeenCalledWith('Reporte de Almacen generado exitosamente');
    });

    it('debe generar un reporte de cuentas exitosamente', () => {
      const nuevoReporte: Reporte = { 
        codigo: 'R006', 
        tipo: 'Cuentas', 
        periodo: 'Junio 2026', 
        responsable: 'Administrador', 
        estado: 'Generado', 
        fecha: '2026-06-10' 
      };
      vi.spyOn(reportesService, 'generarReporte').mockReturnValue(of(nuevoReporte));
      vi.spyOn(reportesService, 'obtenerTodos').mockReturnValue(of([...mockReportes, nuevoReporte]));
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
      
      component.generarReporte('Cuentas');
      
      expect(reportesService.generarReporte).toHaveBeenCalledWith('Cuentas', 'Administrador');
      expect(alertSpy).toHaveBeenCalledWith('Reporte de Cuentas generado exitosamente');
    });
  });

  // ==========================================
  // Test adicional: Limpiar filtro
  // ==========================================
  describe('Limpieza de filtro', () => {
    beforeEach(() => {
      vi.spyOn(reportesService, 'obtenerTodos').mockReturnValue(of(mockReportes));
      fixture.detectChanges();
    });

    it('debe limpiar el filtro y mostrar todos los reportes', () => {
      component.filtroTipo = 'Caja';
      component.aplicarFiltro();
      expect(component.reportesFiltrados.length).toBe(2);
      
      component.limpiarFiltro();
      expect(component.filtroTipo).toBe('');
      expect(component.reportesFiltrados.length).toBe(3);
    });
  });
});