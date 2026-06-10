import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';  // ← AGREGAR
import { Cuentas } from './cuentas-bancarias';
import { CuentasBancariasService } from '../../core/services/cuentas-bancarias';
import { ChangeDetectorRef } from '@angular/core';
import { of } from 'rxjs';
import { vi } from 'vitest';

describe('Cuentas', () => {
  let component: Cuentas;
  let fixture: ComponentFixture<Cuentas>;
  let cuentasService: CuentasBancariasService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        Cuentas
      ],
      providers: [
        CuentasBancariasService,
        provideRouter([]),  // ← AGREGAR
        { provide: ChangeDetectorRef, useValue: { detectChanges: vi.fn() } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Cuentas);
    component = fixture.componentInstance;
    cuentasService = TestBed.inject(CuentasBancariasService);
  });

  it('should create', () => {
    vi.spyOn(cuentasService, 'listarTodas').mockReturnValue(of([]));
    expect(component).toBeTruthy();
  });
});