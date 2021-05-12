import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFacturaComponent } from './create-factura.component';
import {HttpClientModule} from '@angular/common/http';
import { ServicioFirmadoXML } from '../../services/firmadoXML';
import { ServicioCreacionXML } from '../../services/creacionXML';
import { ServicioEnvioXML } from '../../services/envioXML';
import { ServicioClaveXML } from '../../services/claveXML';
import { FormsModule , FormControl, NgForm, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

describe('CreateFacturaComponent', () => {
  let component: CreateFacturaComponent;
  let fixture: ComponentFixture<CreateFacturaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateFacturaComponent ],
      imports: [HttpClientModule, NgbModule, FormsModule],
      providers: [
        {provide: ServicioFirmadoXML, useClass: ServicioFirmadoXML},
        {provide: ServicioCreacionXML, useClass: ServicioCreacionXML},
        {provide: ServicioEnvioXML, useClass: ServicioEnvioXML},
        {provide: ServicioClaveXML, useClass: ServicioClaveXML},
        {provide: FormsModule , useValue: {}}, 
        {provide: NgbModule, useValue: {}}

      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateFacturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

});
