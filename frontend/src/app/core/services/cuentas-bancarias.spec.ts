import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CuentasBancariasService } from './cuentas-bancarias';

describe('CuentasBancariasService', () => {
  let service: CuentasBancariasService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CuentasBancariasService,
        // Configuración moderna para HttpClient en pruebas
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(CuentasBancariasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});