import { ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';

import { ConsultarComponent, XML} from './consultar.component';
//import { CrearNotaComponent, servicio } from '../crear-nota/crear-nota.component'
import {DialogResumen} from './consultar.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OverlayModule } from '@angular/cdk/overlay';
import { ServicioCorreo } from 'src/app/services/correo';
import { Correo } from 'src/app/models/correo';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {HttpClientModule} from '@angular/common/http';
import { ServicioUsuario } from '../../services/usuario'; 

describe('ConsultarComponent', () => {
  let consultarComponent: ConsultarComponent;
  let fixture: ComponentFixture<ConsultarComponent>;
  let dialogComponent : DialogResumen;
  let service: ServicioCorreo;
  //let crearNota: CrearNotaComponent;
  let injector: TestBed;

  let dummyEmails = [
    {email: 'josedmg2011@hotmail.com'}, 
    {email: 'kdaskii@gmail.com'},
    {email: 'garay9@estudiantec.cr'}
  ]

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultarComponent, DialogResumen/*, CrearNotaComponent*/],
      imports : [HttpClientModule],
      providers: [
        {provide: DialogResumen, useClass: DialogResumen},
        {provide: MatDialogRef, useValue: 'open'},
        { provide: MAT_DIALOG_DATA, useValue: {} },
        {provide: MatDialog, useValue: 'open'},
        {provide: ServicioCorreo, useClass: ServicioCorreo},
        {provide: ServicioUsuario, useClass: ServicioUsuario},
       // {provide: CrearNotaComponent, useClass: CrearNotaComponent}
      ]
    })
    .compileComponents();
    injector = getTestBed();
    dialogComponent = injector.inject(DialogResumen);
    service = injector.inject(ServicioCorreo);
    //crearNota = injector.inject(CrearNotaComponent);
    
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultarComponent);
    consultarComponent = fixture.componentInstance;
    fixture.detectChanges();
  });
/*
este Si
  it('SE001 - Enviar correo', async (done) => {
    spyOn(dialogComponent, 'enviarCorreo').and.callThrough();
    dialogComponent.checkOtro = true;
    dummyEmails.forEach(async element => {
      dialogComponent.otraDireccion = element.email;
      await dialogComponent.enviarCorreo();
    })
    
    expect(dialogComponent.enviarCorreo).toHaveBeenCalled();
    done();
  });
  
\\\Este no sirve\\\\\\
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
  */
  it('SE002 - Convertir XML - Traer desde la BD', (done) => {
    dialogComponent.xml = XML;
    dialogComponent.convertirXML().then(async (result) => {
      expect(result).toBeTruthy();
      //console.log(result);
      done();
    }).catch( error => {
      fail(error);
    })
  });

  it('SE003 - Cargar Documentos', (done) =>{
    //consultarComponent.
    consultarComponent.cargarDocumentos().then( async (result) =>{
      expect(result).toBeTruthy();
      done();
    }).catch( error => {
      fail(error);
      done();
    })
  });
/*
  it('SE004 - Crear Nota', (done) => {
    crearNota.setCabys = servicio;
    crearNota.enviar().then( async (result) => {
      expect(result).toBeTruthy();
      done();
    }).catch( error => {
      fail(error);
    })
  });
*/
  
});
