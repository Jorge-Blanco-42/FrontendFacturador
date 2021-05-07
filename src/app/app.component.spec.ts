import { TestBed, getTestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { Observable, of } from 'rxjs';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ServicioTipoCambio } from './services/tipoCambioXML';
import { TipoCambio } from './models/tipoCambio';




describe('AppComponent', () => {


  let injector: TestBed;
  let service: ServicioTipoCambio;
  let httpMock: HttpTestingController;

  
  beforeEach(async () => {


    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
      ],
      declarations: [
        AppComponent
      ],

      providers : [
        {provide: ServicioTipoCambio, useClass : ServicioTipoCambio}
      ]
    }).compileComponents();

  });

  beforeEach( () => {
    injector = getTestBed();
    service = injector.inject(ServicioTipoCambio);
    httpMock = injector.get(HttpTestingController);
  })



  
    it('should create the app', () => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.componentInstance;
      expect(app).toBeTruthy();
    });
  
    it(`should have as title 'Facturador'`, () => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.componentInstance;
      expect(app.title).toEqual('Facturador');
    });
  
    it('should render title', () => {
      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();
      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('.content span').textContent).toContain('Facturador');
    });
  
    
});


