import { Component, OnInit } from '@angular/core';
import { ServicioFirmadoXML } from '../../services/firmadoXML';
import { ServicioClaveXML } from '../../services/claveXML'
import { ServicioCreacionXML } from '../../services/creacionXML';
import { FirmadoXML } from '../../models/firmadoXML';
import { CreacionXML } from '../../models/creacionXML';
import { ServicioEnvioXML } from '../../services/envioXML';
import { EnvioXML } from '../../models/envioXML';
import { ClaveXML } from '../../models/claveXML';
import { TipoCambio } from '../../models/tipoCambio';
import { ServicioTipoCambio } from '../../services/tipoCambioXML';
import { DatePipe } from '@angular/common'
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { FormBuilder, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { Linea } from 'src/app/models/linea';
import { OtroCargo } from 'src/app/models/otroCargo';

@Component({
  selector: 'app-create-factura',
  templateUrl: './create-factura.component.html',
  styleUrls: ['./create-factura.component.css'],
  providers: [DatePipe, ServicioTipoCambio]
})
export class CreateFacturaComponent implements OnInit {

  impuestoTarifa: Map<string, number>;
  public isCollapsedEmisorData = true;
  public datosXML: CreacionXML;
  public cambio: TipoCambio;
  public tipo_cambio: Number;
  public maxDate = new Date();
  public lineas: Linea[] = [];
  public otrosCargos: OtroCargo[] = [];
  control = new FormControl();
  streets: string[] = ['Champs-Élysées', 'Lombard Street', 'Abbey Road', 'Fifth Avenue', 'Lombard Street', 'Abbey Road', 'Fifth Avenue', 'Lombard Street', 'Abbey Road', 'Fifth Avenue', 'Lombard Street', 'Abbey Road', 'Fifth Avenue'];
  filteredStreets: Observable<string[]>;

  constructor(public datepipe: DatePipe, private _servicioTipoCambio: ServicioTipoCambio) {
    this.datosXML = new CreacionXML("", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "");
    this.cambio = new TipoCambio("", "", "");
    this.tipo_cambio = 0;
    this.filteredStreets = this.control.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
    this.impuestoTarifa = new Map();
    this.impuestoTarifa.set("01-01", 0);
    this.impuestoTarifa.set("01-02", 1.01);
    this.impuestoTarifa.set("01-03", 1.02);
    this.impuestoTarifa.set("01-04", 1.04);
    this.impuestoTarifa.set("01-05", 0);
    this.impuestoTarifa.set("01-06", 1.02);
    this.impuestoTarifa.set("01-07", 1.04);
    this.impuestoTarifa.set("01-08", 1.13);
    this.impuestoTarifa.set("07", 0);
    this.impuestoTarifa.set("08", 0);
  }

  ngOnInit(): void {
    this.datosXML.condicion_venta = "Contado";
    this.datosXML.medio_pago = "Efectivo";
    this.actualizarTipoCambio(this.maxDate);
  }

  private _filter(value: string): string[] {
    const filterValue = this._normalizeValue(value);
    return this.streets.filter(street => this._normalizeValue(street).includes(filterValue));
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }

  enviar(form: any): void {
    console.log(form);
  }

  cambioFecha(event: MatDatepickerInputEvent<Date>) {
    if (event.value) {
      this.actualizarTipoCambio(event.value);
    }
  }

  actualizarTipoCambio(fecha: Date) {
    let latest_date = this.datepipe.transform(fecha, 'yyyy-MM-dd');
    console.log(latest_date);
    let arrayfecha = [];
    if (latest_date) {
      arrayfecha = latest_date.split("-");
      this.cambio.año = arrayfecha[0];
      this.cambio.mes = arrayfecha[1];
      this.cambio.dia = arrayfecha[2];
    }
    this._servicioTipoCambio.getTipoCambio(this.cambio).subscribe(
      result => {
        console.log("Tipo de cambio: ", <any>result)
        this.tipo_cambio = result.venta;
        this.datosXML.tipo_cambio = this.tipo_cambio.toString();
      },
      error => {
        console.log(<any>error)
      }
    );
  }
  actualizarTarifa(linea: Linea) {
    let tarifa = this.impuestoTarifa.get(linea.impuesto);
    console.log(tarifa);
    if (tarifa != undefined){
      linea.tarifa = tarifa;
    }    
    console.log(linea);
  }

  calcularTotales(linea: Linea) {
    let subtotal = linea.cantidad * linea.precioUnitario
    linea.subtotal = (subtotal).toString();
    console.log(linea.porcentaje);
    if (linea.porcentaje) {  
      if(linea.tarifa != 0){
        linea.total = (subtotal * linea.tarifa - (subtotal * (linea.descuento/100))).toString();
      }   else{
        linea.total = (subtotal - (subtotal * (linea.descuento/100))).toString();
      }
      
    }else{
      if(linea.tarifa != 0){
        linea.total = (subtotal * linea.tarifa - linea.descuento).toString();
      }else{
        linea.total = (subtotal - linea.descuento).toString();
      }
      
    }

  }

  nuevoCargo() {
    this.otrosCargos.push(new OtroCargo("", "", "", "", "", "", ""));
  }

  borrarCargo(index: number) {
    this.otrosCargos.splice(index, 1);
  }

  nuevaLinea() {
    this.lineas.push(new Linea("", 0, "Sp", 0, 0, "", "01-08", false, 0, 1.13, "", ""));
  }

  borrarLinea(index: number) {
    this.lineas.splice(index, 1)
  }
}
