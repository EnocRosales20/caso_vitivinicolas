import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { Almacen } from './almacen';
import { AlmacenService } from '../../core/services/almacen.service'; 

describe('Almacen', () => {
  let component: Almacen;
  let fixture: ComponentFixture<Almacen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Importamos los módulos necesarios para que el componente funcione
      imports: [
        Almacen,                
        HttpClientTestingModule, 
        FormsModule              
      ],
      // Proveemos el servicio para que pueda ser inyectado sin errores
      providers: [
        AlmacenService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Almacen);
    component = fixture.componentInstance;
    
    // Detectamos cambios para inicializar el componente
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});