import { TestBed } from '@angular/core/testing';

import { CuentasBancarias } from './cuentas-bancarias';

describe('CuentasBancarias', () => {
  let service: CuentasBancarias;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CuentasBancarias);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
