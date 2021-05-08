import { ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';

import { ConsultarComponent } from './consultar.component';
import {DialogAnular} from './consultar.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OverlayModule } from '@angular/cdk/overlay';
import { ServicioCorreo } from 'src/app/services/correo';
import { Correo } from 'src/app/models/correo';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {HttpClientModule} from '@angular/common/http';

describe('ConsultarComponent', () => {
  let component: ConsultarComponent;
  let fixture: ComponentFixture<ConsultarComponent>;
  let dialogComponent : DialogAnular;
  let injector: TestBed;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultarComponent, DialogAnular],
      imports : [HttpClientTestingModule],
      providers: [
        {provide: DialogAnular, useClass: DialogAnular},
        {provide: MatDialogRef, useValue: 'open'},
        { provide: MAT_DIALOG_DATA, useValue: {} },
        {provide: MatDialog, useValue: 'open'},
        {provide: ServicioCorreo, useClass: ServicioCorreo},

      ]
    })
    .compileComponents();
    injector = getTestBed();
    dialogComponent = injector.inject(DialogAnular);
    
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Send email',  async (done) => {
    spyOn(dialogComponent, 'enviarCorreo').and.callThrough();
    dialogComponent.checkOtro = true;
    dialogComponent.otraDireccion = 'josedmg2011@hotmail.com';
    dialogComponent.enviarCorreo();
    expect(dialogComponent.enviarCorreo).toHaveBeenCalled();
    done();
  })
});
