import { Component, OnInit } from '@angular/core';
import { ServicioFirmadoXML } from '../../services/firmadoXML';
import { ServicioClaveXML } from '../../services/claveXML'
import { ServicioCreacionXML } from '../../services/creacionXML';
import { FirmadoXML } from '../../models/firmadoXML';
import { CreacionXML } from '../../models/creacionXML';
import { ServicioEnvioXML } from '../../services/envioXML';
import { EnvioXML } from '../../models/envioXML';
import { ClaveXML } from '../../models/claveXML';
import {TipoCambio} from '../../models/tipoCambio';
import {ServicioTipoCambio} from '../../services/tipoCambioXML';
import { DatePipe } from '@angular/common'

@Component({
  selector: 'app-create-factura',
  templateUrl: './create-factura.component.html',
  styleUrls: ['./create-factura.component.css'],
  providers: [DatePipe]
})
export class CreateFacturaComponent implements OnInit {

  public isCollapsedEmisorData = true;
  public moneda = "dólares";
  public datosXML: CreacionXML;
  public cambio: TipoCambio;


  constructor(public datepipe: DatePipe) {
    this.datosXML = new CreacionXML("","","","","","","","","","","","","","","","",
                                    "","","","","","","","","","","","","","","","",
                                    "","","","","","","","","","","","","","","","",
                                    "","","");
    this.cambio = new TipoCambio("","","");
   }

  ngOnInit(): void {
    this.datosXML.condicion_venta = "Contado";
    this.datosXML.medio_pago = "Efectivo";
    var fecha = new Date();
    let latest_date =this.datepipe.transform(fecha, 'yyyy-MM-dd');
    console.log(latest_date);
    this.cambio
  }

  enviar(form :any): void{
    console.log(form);
  }

}
