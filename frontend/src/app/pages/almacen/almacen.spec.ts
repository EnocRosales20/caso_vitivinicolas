import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http'; // <-- Importación moderna
import { provideHttpClientTesting } from '@angular/common/http/testing'; // <-- Importación moderna
import { FormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router'; 
import { Almacen } from './almacen';
import { AlmacenService } from '../../core/services/almacen.service'; 

describe('Almacen', () => {
  let component: Almacen;
  let fixture: ComponentFixture<Almacen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        Almacen,             
        FormsModule            
      ],
      providers: [
        AlmacenService,
        provideRouter([]),
        provideHttpClient(), // <-- Proveedor moderno
        provideHttpClientTesting() // <-- Proveedor moderno de pruebas
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Almacen);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});