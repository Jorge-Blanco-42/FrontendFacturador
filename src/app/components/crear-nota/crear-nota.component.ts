import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CreacionXML } from 'src/app/models/creacionXML';
import { Linea } from 'src/app/models/linea';
import { OtroCargo } from 'src/app/models/otroCargo';
import { ServicioCaByS } from 'src/app/services/cabys';

const replacer = new RegExp('\"', 'g');

@Component({
  selector: 'app-crear-nota',
  templateUrl: './crear-nota.component.html',
  styleUrls: ['./crear-nota.component.css'],
  providers: [ServicioCaByS]
})
export class CrearNotaComponent implements OnInit {

  nombreEmisor = "Rodolfo de Jesus Mora Zamora";
  cedulaEmisor = "113160737";
  correoEmisor = "jorge.luis1999@hotmail.com";
  telefonoEmisor = "8888-8888";

  nombreReceptor = "María Fernanda Niño";
  cedulaReceptor = "117170242";
  correoReceptor = "maf.nino7@gmail.com";
  telefonoReceptor = "8888-8888";

  public total_OtrosCargos: number;
  public impuestoTarifa: Map<string, number>;

  public lineas: Linea[] = [];
  public otrosCargos: OtroCargo[] = [];
  public datosXML: CreacionXML;

  public isCollapsedResumenData: boolean = true;

  cabys: { impuesto: string, descripcion: string, codigoBienServicio: string }[] = [];
  dataSourceResumen: MatTableDataSource<Linea> = new MatTableDataSource(this.lineas);
  displayedColumnsResumen: string[] = ['productoLinea', 'cantidadProductoLinea', 'totalLinea'];

  constructor(
    public dialogRef: MatDialogRef<CrearNotaComponent>,
    @Inject(MAT_DIALOG_DATA) public tipoNota: string, private _servicioCaByS: ServicioCaByS) {
      this.total_OtrosCargos = 0;
      this.impuestoTarifa = new Map();
      this.datosXML = new CreacionXML("genXML", "gen_xml_fe", "", "", new Date().toString(),
      this.nombreEmisor, "01", this.cedulaEmisor, "n/a",
      "1", "10", "04", "04", "Mi casa", "506", this.telefonoEmisor,
      "506", "00000000", this.correoEmisor, this.nombreReceptor, "", this.cedulaReceptor,
      "", "", "", "", "506", this.telefonoReceptor, "506", "", this.correoReceptor, "01", "0", "01", "CRC",
      "", "", "", "", "", "", "", "", "", "", "", "", "nada", "nada", "", "False");
     }

  @ViewChild('resumenPaginator')
  paginatorResumen!: MatPaginator;

  ngOnInit(): void {
    this.getCabys();
    this.impuestoTarifa.set("01-01", 1.0);
    this.impuestoTarifa.set("01-02", 1.01);
    this.impuestoTarifa.set("01-03", 1.02);
    this.impuestoTarifa.set("01-04", 1.04);
    this.impuestoTarifa.set("01-05", 1.0);
    this.impuestoTarifa.set("01-06", 1.02);
    this.impuestoTarifa.set("01-07", 1.04);
    this.impuestoTarifa.set("01-08", 1.13);
    this.impuestoTarifa.set("07-02", 1.01);
    this.impuestoTarifa.set("07-03", 1.02);
    this.impuestoTarifa.set("07-04", 1.04);
    this.impuestoTarifa.set("07-05", 1.0);
    this.impuestoTarifa.set("07-06", 1.02);
    this.impuestoTarifa.set("07-07", 1.04);
    this.impuestoTarifa.set("07-08", 1.13);
    this.impuestoTarifa.set("08", 0);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  toggleResumen() {
    this.isCollapsedResumenData = !this.isCollapsedResumenData;
    // this.emisorDeshabilitado = true;
  }

  enviarNota(){

  }

  filtroCabys(evt: string, linea: Linea) {
    linea.filtro = this._filter(evt);
  }

  getCabys() {
    let cabysS = localStorage.getItem("cabys");
    if (cabysS) {
      this.cabys = JSON.parse(cabysS);
      let descripcionesS = localStorage.getItem("cabys");
    } else {
      this._servicioCaByS.getCaByS().subscribe(
        result => {
          this.cabys = result;
          localStorage.setItem("cabys", JSON.stringify(result))
          localStorage.setItem("descripciones", JSON.stringify(this.cabys))
          //console.log("traido", this.descripciones[0]);
        },
        error => {
          //console.log(<any>error)
        }
      );
    }
    ////console.log(this.streets);
  }

  setCabys(linea: Linea, cabys: { descripcion: string, impuesto: string, codigoBienServicio: string }) {
    let impuesto = cabys.impuesto;
    switch (impuesto) {
      case "1%":
        linea.impuesto = "01-02"
        break;
      case "2%":
        linea.impuesto = "01-03"
        break;
      case "4%":
        linea.impuesto = "01-04"
        break;
      case "13%":
        linea.impuesto = "01-08"
        break;
      default:
        linea.impuesto = "01-01"
        break;
    }
    linea.codigo = cabys.codigoBienServicio;
    this.actualizarTarifaLinea(linea);
  }

  actualizarTarifaLinea(linea: Linea) {
    let tarifa = this.impuestoTarifa.get(linea.impuesto);
    //console.log(tarifa);
    if (tarifa != undefined) {
      linea.tarifa = tarifa;
    }
    //console.log(linea);
    this.calcularTotalesLinea(linea);
  }

  calcularTotalesLinea(linea: Linea) {
    linea.subtotal = linea.cantidad * linea.precioUnitario
    //console.log(linea.porcentaje);
    let montoImpuesto = 0;
    let montoDescuento = 0;
    if (linea.impuesto.slice(0, 2) === '07') {
      montoImpuesto = (linea.tarifa - 1) * linea.base;
    } else {
      montoImpuesto = (linea.tarifa - 1) * linea.subtotal;
    }
    if (linea.porcentaje) {
      montoDescuento = (linea.subtotal * (linea.descuento / 100));
    } else {
      montoDescuento = linea.descuento;
    }
    linea.total = linea.subtotal + montoImpuesto - montoDescuento;
    //console.log(linea.total, montoImpuesto, montoDescuento);
    this.calcularTotales();
  }

  calcularTotales() {
    //console.log("suelte la harina, pa");
    this.total_OtrosCargos = 0;
    let total_comprobante = 0;
    let total_serv_gravados = 0;
    let total_serv_exentos = 0;
    let total_serv_exonerados = 0;
    let total_merc_gravada = 0;
    let total_merc_exenta = 0;
    let total_merc_exonerados = 0;
    let total_gravados = 0;
    let total_exentos = 0;
    let total_exonerados = 0;
    let total_ventas = 0;
    let total_descuentos = 0;
    let total_ventas_neta = 0;
    let total_impuestos = 0;
    this.lineas.forEach(linea => {
      if (linea.impuesto === "01-01" || linea.impuesto === '01-05') {//Exento
        if (linea.tipo === 'Sp' || linea.tipo === 'St' || linea.tipo === 'Os') {
          total_serv_exentos += linea.subtotal;
        } else {
          total_merc_exenta += linea.subtotal;
        }
        total_exentos += linea.subtotal;
      } else {//gravado
        if (linea.tipo === 'Sp' || linea.tipo === 'St' || linea.tipo === 'Os') {
          total_serv_gravados += linea.subtotal;
        } else {
          total_merc_gravada += linea.subtotal;
        }
        total_gravados += linea.subtotal;
      }
      if (linea.porcentaje) {
        total_descuentos += linea.subtotal * (linea.descuento / 100);
      } else {
        total_descuentos += linea.descuento;
      }
      if (linea.impuesto.slice(0, 2) === '07') {
        total_impuestos += (linea.tarifa - 1) * linea.base;
      } else {
        total_impuestos += (linea.tarifa - 1) * linea.subtotal;
      }
    });
    total_ventas = total_gravados + total_exentos + total_exonerados;
    this.datosXML.total_ventas = total_ventas.toString();
    this.otrosCargos.forEach(cargo => {
      //console.log("cargo");
      this.actualizarCargo(cargo);
    });
    total_ventas_neta = total_ventas - total_descuentos;
    total_comprobante = total_ventas_neta + total_impuestos + this.total_OtrosCargos;
    this.datosXML.total_comprobante = total_comprobante.toString();
    this.datosXML.total_serv_gravados = total_serv_gravados.toString();
    this.datosXML.total_serv_exentos = total_serv_exentos.toString();
    this.datosXML.total_merc_gravada = total_merc_gravada.toString();
    this.datosXML.total_merc_exenta = total_merc_exenta.toString();
    this.datosXML.total_gravados = total_gravados.toString();
    this.datosXML.total_exentos = total_exentos.toString();

    this.datosXML.total_descuentos = total_descuentos.toString();
    this.datosXML.total_ventas_neta = total_ventas_neta.toString();
    this.datosXML.total_impuestos = total_impuestos.toString();


  }

  private _filter(value: string): { descripcion: string, impuesto: string, codigoBienServicio: string }[] {
    if (value) {
      const filterValue = this._normalizeValue(value);
      if (filterValue.length > 3) {
        return this.cabys.filter(cabys => this._normalizeValue(cabys.descripcion).includes(filterValue));
      }
      return this.cabys.slice(0, 50);
    } else {
      return this.cabys.slice(0, 50);
    }
  }

  private _normalizeValue(value: string): string {
    //console.log("normalize value ",value);
    return value.toLowerCase().replace(/\s/g, '');
  }

  nuevoCargo() {
    this.otrosCargos.push(new OtroCargo("", "", 1, false, "", "", "", 0));
  }

  borrarCargo(index: number) {
    this.otrosCargos.splice(index, 1);
  }

  setMontoCargo(cargo: OtroCargo) {
    if (cargo.tipoDocumento === "06") {
      cargo.porcentaje = true;
      cargo.monto = 10;
    }
    this.actualizarCargo(cargo);
  }

  actualizarCargo(cargo: OtroCargo) {
    //console.log("UPDATE");
    if (cargo.porcentaje) {
      cargo.total = Number(this.datosXML.total_ventas) * (cargo.monto / 100);
    } else {
      cargo.total = cargo.monto;
    }
    this.total_OtrosCargos = 0;
    this.otrosCargos.forEach(cargo => {
      this.total_OtrosCargos += cargo.total;
    });
  }

  nuevaLinea() {
    var control = new FormControl();
    var filtro = this._filter("");
    this.lineas.push(new Linea("", "", filtro, 1, "Sp", 5, 0, "", "01-08", false, 0, 1.13, 0, 0));
    this.dataSourceResumen.data = this.lineas;
    this.dataSourceResumen.connect().next(this.lineas);
    if (this.paginatorResumen) {
      this.paginatorResumen._changePageSize(this.paginatorResumen.pageSize);
      //console.log("caca")
    }
    this.setDataSourceResumenAttributes()
    console.log(this.dataSourceResumen);
  }

  borrarLinea(index: number) {
    this.lineas.splice(index, 1)
    this.dataSourceResumen.data = this.dataSourceResumen.data;
    this.setDataSourceResumenAttributes()
  }

  setDataSourceResumenAttributes() {
    if (this.paginatorResumen) {
      this.dataSourceResumen.paginator = this.paginatorResumen;
    }
  }

  lineaNormal(linea: Linea): string {
    let producto = linea.producto.replace(replacer, "&quot;");
    return '{"cantidad":"' + linea.cantidad + '","unidadMedida":"' + linea.tipo + '","detalle":"' + producto +
      '","precioUnitario":"' + linea.precioUnitario + '","montoTotal":"' + linea.total + '","subTotal":"' + linea.subtotal +
      '","montoTotalLinea":"' + linea.total + '"';
  }

  lineaConDescuento(linea: Linea) {
    let lineaStr = this.lineaNormal(linea);
    if (linea.porcentaje) {
      lineaStr += ',"montoDescuento":"' + ((linea.descuento / 100) * linea.subtotal) + '","naturalezaDescuento":"' + linea.razon + '"';
    } else {
      lineaStr += ',"montoDescuento":"' + linea.descuento + '","naturalezaDescuento":"' + linea.razon + '"';
    }
    return lineaStr;
  }

  lineaConImpuesto(linea: Linea, lineaStr: string): string {
    let impuesto = linea.impuesto.slice(0, 2);
    lineaStr += ',"impuesto":';
    lineaStr += '{"1":{"codigo":"' + linea.impuesto.slice(0, 2);
    if (impuesto === '01' || impuesto === '07') { //IVA
      lineaStr += '","codigoTarifa":"' + linea.impuesto.slice(3, 5) +
        '","tarifa":"' + Math.round((linea.tarifa - 1) * 100) + '"';
      if (impuesto === '01') {
        lineaStr += ',"monto":"' + Math.round((linea.tarifa - 1) * linea.subtotal * 100) / 100 + '"}}';
      } else {
        lineaStr += '","monto":"' + Math.round((linea.tarifa - 1) * linea.base * 100) / 100 + '"}}';
      }
    } else {
      lineaStr += '","Factor IVA":"' + Math.round((linea.tarifa - 1) * 100) +
        '","monto":"' + Math.round((linea.tarifa - 1) * linea.subtotal * 100) / 100 + '"}}';
    }
    return lineaStr;
  }

}
