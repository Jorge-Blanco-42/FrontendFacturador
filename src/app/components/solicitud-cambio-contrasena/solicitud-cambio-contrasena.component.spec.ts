import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudCambioContrasenaComponent } from './solicitud-cambio-contrasena.component';

describe('SolicitudCambioContrasenaComponent', () => {
  let component: SolicitudCambioContrasenaComponent;
  let fixture: ComponentFixture<SolicitudCambioContrasenaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolicitudCambioContrasenaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudCambioContrasenaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
