import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuiasAlmacen } from './guias-almacen';

describe('GuiasAlmacen', () => {
  let component: GuiasAlmacen;
  let fixture: ComponentFixture<GuiasAlmacen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuiasAlmacen],
    }).compileComponents();

    fixture = TestBed.createComponent(GuiasAlmacen);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
