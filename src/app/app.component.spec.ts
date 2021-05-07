import { TestBed, getTestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ServicioTipoCambio } from './services/tipoCambioXML';
import { TipoCambio } from './models/tipoCambio';
describe('AppComponent', () => {


  beforeEach(async () => {


    let injector: TestBed;
    let service: ServicioTipoCambio;
    let httpMock: HttpTestingController;

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        ServicioTipoCambio
      ]
    }).compileComponents();

    beforeEach(() => {
      injector = getTestBed();
      service = injector.get(ServicioTipoCambio);
      httpMock = injector.get(HttpTestingController );
    });

    afterEach(() => {
      httpMock.verify();
    });
  
    it('#MostrarCambio', () => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.componentInstance;
      let tipoCambio = new TipoCambio('11', '03', '2020');
      service.getTipoCambio(tipoCambio).subscribe(result => {
        expect(result.compra).toEqual(564.57);
      })
  
    });


  });

 
  
/*
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

  */
});


