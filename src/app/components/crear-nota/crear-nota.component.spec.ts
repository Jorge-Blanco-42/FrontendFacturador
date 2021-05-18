import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CrearNotaComponent } from './crear-nota.component';
import {HttpClientModule} from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { from } from 'rxjs';


describe('CrearNotaComponent', () => {
  let component: CrearNotaComponent;
  let fixture: ComponentFixture<CrearNotaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearNotaComponent ],
      imports: [HttpClientModule, NgbModule],
      providers : [
        {provide: MatDialogRef, useValue: 'open'},
        { provide: MAT_DIALOG_DATA, useValue: {} },
        {provide: MatDialog, useValue: 'open'},
        {provide: NgbModule, useValue: {}}
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearNotaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('SE004 - Crear Nota', async () => {
    var res = from(await component.enviar2());
    res.subscribe( result => {
      expect(result).toBeNull();
    },
    error => {
      fail(error);
    });
  });

});
