import { ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';

import { ConsultarComponent, XML } from './consultar.component';
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
  let service: ServicioCorreo;
  let injector: TestBed;

  let dummyEmails = [
    {email: 'josedmg2011@hotmail.com'}, 
    {email: 'kdaskii@gmail.com'},
    {email: 'garay9@estudiantec.cr'}
  ]

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultarComponent, DialogAnular],
      imports : [HttpClientModule],
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
    service = injector.inject(ServicioCorreo);
    
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

/*
  it('SE001 - Enviar correo', async (done) => {
    spyOn(dialogComponent, 'enviarCorreo').and.callThrough();
    dialogComponent.checkOtro = true;
    dummyEmails.forEach(async element => {
      dialogComponent.otraDireccion = element.email;
      await dialogComponent.enviarCorreo();
    })
    
    expect(dialogComponent.enviarCorreo).toHaveBeenCalled();
    done();
  });*/

  it('SE001 - Enviar correo2', async (done) => {
    let correo: Correo = new Correo("","Factura electrónica Garay", "Se adjunta factura eléctronica",
    "Factura.xml", XML, "base64" );
    correo.to = 'josedmg2011@hotmail.com';
    await dialogComponent.enviarCorreo2(correo).then( ans =>{
      expect(ans).toBeNull();
    },
    err => {
      expect(err).toBeNull();
    });
    done();
     
  });


});
