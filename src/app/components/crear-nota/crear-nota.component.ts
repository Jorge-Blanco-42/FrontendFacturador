import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Certificado } from 'src/app/models/certificado';
import { ClaveXML } from 'src/app/models/claveXML';
import { CreacionXML } from 'src/app/models/creacionXML';
import { EnvioXML } from 'src/app/models/envioXML';
import { FirmadoXML } from 'src/app/models/firmadoXML';
import { Linea } from 'src/app/models/linea';
import { OtroCargo } from 'src/app/models/otroCargo';
import { ServicioCaByS } from 'src/app/services/cabys';
import { ServicioCertificado } from 'src/app/services/certificado';
import { ServicioClaveXML } from 'src/app/services/claveXML';
import { ServicioDecodificador } from 'src/app/services/decodificador';
import { ServicioEnvioXML } from 'src/app/services/envioXML';
import { ServicioEscritorXML } from 'src/app/services/escritorXML';
import { ServicioFirmadoXML } from 'src/app/services/firmadoXML';
import { ServicioUsuario } from 'src/app/services/usuario';

const replacer = new RegExp('\"', 'g');

//export const servicio 
 const XML = "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48TWVuc2FqZUhhY2llbmRhIHhtbG5zPSJodHRwczovL2Nkbi5jb21wcm9iYW50ZXNlbGVjdHJvbmljb3MuZ28uY3IveG1sLXNjaGVtYXMvdjQuMy9tZW5zYWplSGFjaWVuZGEiPgogICAgPENsYXZlPjUwNjAzMDUyMTAwMDExNzUxMDE2OTAwMTAwMDAxMDEwMTAwMDEyMzczMTk4NzYyMjU5PC9DbGF2ZT4KICAgIDxOb21icmVFbWlzb3I+REVTQ09OT0NJRE88L05vbWJyZUVtaXNvcj4KICAgIDxUaXBvSWRlbnRpZmljYWNpb25FbWlzb3I+MDE8L1RpcG9JZGVudGlmaWNhY2lvbkVtaXNvcj4KICAgIDxOdW1lcm9DZWR1bGFFbWlzb3I+MTE3NTEwMTY5PC9OdW1lcm9DZWR1bGFFbWlzb3I+CiAgICA8VGlwb0lkZW50aWZpY2FjaW9uUmVjZXB0b3I+MDE8L1RpcG9JZGVudGlmaWNhY2lvblJlY2VwdG9yPgogICAgPE51bWVyb0NlZHVsYVJlY2VwdG9yPjExNzE3MDI0MjwvTnVtZXJvQ2VkdWxhUmVjZXB0b3I+CiAgICA8TWVuc2FqZT4zPC9NZW5zYWplPgogICAgPERldGFsbGVNZW5zYWplPkVzdGUgY29tcHJvYmFudGUgZnVlIGFjZXB0YWRvIGVuIGVsIGFtYmllbnRlIGRlIHBydWViYXMsIHBvciBsbyBjdWFsIG5vIHRpZW5lIHZhbGlkZXogcGFyYSBmaW5lcyB0cmlidXRhcmlvcwoKRWwgY29tcHJvYmFudGUgZWxlY3Ryw7NuaWNvIHRpZW5lIGxvcyBzaWd1aWVudGVzIGVycm9yZXM6IApbCkxhIGZpcm1hIGRlbCBjb21wcm9iYW50ZSBlbGVjdHLDs25pY28gbm8gZXMgdsOhbGlkYSAoRWwgWE1MIGZ1ZSBtb2RpZmljYWRvIGx1ZWdvIGRlIGhhYmVyIHNpZG8gZmlybWFkbykuCl08L0RldGFsbGVNZW5zYWplPgogICAgPFRvdGFsRmFjdHVyYT4wPC9Ub3RhbEZhY3R1cmE+CjxkczpTaWduYXR1cmUgeG1sbnM6ZHM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvMDkveG1sZHNpZyMiIElkPSJpZC1iMWU2YmIzMTY1MjkwYWRlZTYyMTVjYmYxYThhMWUyNSI+PGRzOlNpZ25lZEluZm8+PGRzOkNhbm9uaWNhbGl6YXRpb25NZXRob2QgQWxnb3JpdGhtPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzEwL3htbC1leGMtYzE0biMiLz48ZHM6U2lnbmF0dXJlTWV0aG9kIEFsZ29yaXRobT0iaHR0cDovL3d3dy53My5vcmcvMjAwMS8wNC94bWxkc2lnLW1vcmUjcnNhLXNoYTI1NiIvPjxkczpSZWZlcmVuY2UgSWQ9InItaWQtMSIgVHlwZT0iIiBVUkk9IiI+PGRzOlRyYW5zZm9ybXM+PGRzOlRyYW5zZm9ybSBBbGdvcml0aG09Imh0dHA6Ly93d3cudzMub3JnL1RSLzE5OTkvUkVDLXhwYXRoLTE5OTkxMTE2Ij48ZHM6WFBhdGg+bm90KGFuY2VzdG9yLW9yLXNlbGY6OmRzOlNpZ25hdHVyZSk8L2RzOlhQYXRoPjwvZHM6VHJhbnNmb3JtPjxkczpUcmFuc2Zvcm0gQWxnb3JpdGhtPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzEwL3htbC1leGMtYzE0biMiLz48L2RzOlRyYW5zZm9ybXM+PGRzOkRpZ2VzdE1ldGhvZCBBbGdvcml0aG09Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvMDQveG1sZW5jI3NoYTI1NiIvPjxkczpEaWdlc3RWYWx1ZT5ibHZ2UXBhdFN4RlpVeUp2UEpPVW9jTEpDN24yVDRSOGNsZVI4eW9TNHp3PTwvZHM6RGlnZXN0VmFsdWU+PC9kczpSZWZlcmVuY2U+PGRzOlJlZmVyZW5jZSBUeXBlPSJodHRwOi8vdXJpLmV0c2kub3JnLzAxOTAzI1NpZ25lZFByb3BlcnRpZXMiIFVSST0iI3hhZGVzLWlkLWIxZTZiYjMxNjUyOTBhZGVlNjIxNWNiZjFhOGExZTI1Ij48ZHM6VHJhbnNmb3Jtcz48ZHM6VHJhbnNmb3JtIEFsZ29yaXRobT0iaHR0cDovL3d3dy53My5vcmcvMjAwMS8xMC94bWwtZXhjLWMxNG4jIi8+PC9kczpUcmFuc2Zvcm1zPjxkczpEaWdlc3RNZXRob2QgQWxnb3JpdGhtPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGVuYyNzaGEyNTYiLz48ZHM6RGlnZXN0VmFsdWU+QWtwN0tiM2VYdzlmRzEzb0Q2dFdHKzNEWU50aDRyd3EwM21kWWpjK0MxMD08L2RzOkRpZ2VzdFZhbHVlPjwvZHM6UmVmZXJlbmNlPjwvZHM6U2lnbmVkSW5mbz48ZHM6U2lnbmF0dXJlVmFsdWUgSWQ9InZhbHVlLWlkLWIxZTZiYjMxNjUyOTBhZGVlNjIxNWNiZjFhOGExZTI1Ij5hOWFBSnVyWnk0UEhkVld4TzdCd2FDNEQ2UC9oRTJnUEFkM2ZPUUpCOVNZaXVqV0M4RHduMHZ2aS9hMVZwV0Z5V1BaNUVoL3dJU0ZwSnRCc0k1L3E0VEh1T29vY0x4Slo2SDB2RkhTU1d6MldvcjJIUUgyVDQyTGFJRlhOZUlXOHNyVWxwTEN0dFpMbnlDOXhTZVdzOG5hVGVVczdHSVA2aTNtcCtNOGtmSDBzaU16eUhtK3pGMy9kTWd0Z2JwcVdIWWt0Sm91cEJ2bDZyNjZMS2JEZmxZWWdGcGJBRjRCeFd0akdCVVBaSTVLK25GTG16TzF5cXpEYmw2b2FIUEFZcitBQ040MERteGZ3TXdQc082TUtkTkJ6OTZpeXVvMmVYZ3NhKzZYcmFveWdvSnhBSXRISVdaKzlMZEhlcVFDQnFudzdldThxQVJTUUNjbnVqUEZVd0E9PTwvZHM6U2lnbmF0dXJlVmFsdWU+PGRzOktleUluZm8+PGRzOlg1MDlEYXRhPjxkczpYNTA5Q2VydGlmaWNhdGU+TUlJRmh6Q0NCRytnQXdJQkFnSVRTQUFBQWhlSTQrVi9oaVVrN1FBQkFBQUNGekFOQmdrcWhraUc5dzBCQVFzRkFEQ0JtekVaTUJjR0ExVUVCUk1RUTFCS0xUUXRNREF3TFRBd05EQXhOekVMTUFrR0ExVUVCaE1DUTFJeEpEQWlCZ05WQkFvVEcwSkJUa05QSUVORlRsUlNRVXdnUkVVZ1EwOVRWRUVnVWtsRFFURWlNQ0FHQTFVRUN4TVpSRWxXU1ZOSlQwNGdVMGxUVkVWTlFWTWdSRVVnVUVGSFR6RW5NQ1VHQTFVRUF4TWVRMEVnVTBsT1VFVWdMU0JRUlZKVFQwNUJJRXBWVWtsRVNVTkJJSFl5TUI0WERURTVNVEl5TXpFM05ETXhObG9YRFRJek1USXlNakUzTkRNeE5sb3dmekVaTUJjR0ExVUVCUk1RUTFCS0xUSXRNVEF3TFRBME1qQXdOVEVMTUFrR0ExVUVCaE1DUTFJeEdUQVhCZ05WQkFvVEVGQkZVbE5QVGtFZ1NsVlNTVVJKUTBFeE9qQTRCZ05WQkFNVE1VVlRWRUZFVHkxTlNVNUpVMVJGVWtsUElFUkZJRWhCUTBsRlRrUkJJQ2hUUlV4TVR5QkZURVZEVkZKUFRrbERUeWt3Z2dFaU1BMEdDU3FHU0liM0RRRUJBUVVBQTRJQkR3QXdnZ0VLQW9JQkFRRGtuSExyZUhPTUJUY0s0MnBUSDZDbVFQRTZncGY3VTdSdnNzWjNmMjR4akxxajdLL1huVkkzdEZrcW50a21wMmVNK2lYeXMxQXlzS3g3QURRQlB2NWdOZWlHQzVkTkRtNEY5RXBJbSthLzJmcFU3dE5HdnhSQ281RHFZMG1lREhJa0ZlUkZObHladTR4aFVjNWZqWVNQczkxKytkOCtjcnpiSUlabElQNHh3czNKOTJiZU44Z3U5YWRreHQ0VmhBbmdtN0RVN2dwWVlBLy9DSkZvL05aTWtaYUwrbVBxUTJ2SHB6SW9SWSsvcGxzbzhvL25UREJLejVzcHJLYjJzbTRYQTRzczd4NHRoaXhTblVoOEdxNVl5SlQzOTR0bkJtWGd4TmtrSm5kUHczTXpJay91Mm5WNlozY0VYbkpHN3ZPOVdMb09vMTFiK0REdlpYZm54MEhUQWdNQkFBR2pnZ0hkTUlJQjJUQU9CZ05WSFE4QkFmOEVCQU1DQnNBd0hRWURWUjBPQkJZRUZKR0EzOGE0SkdCSG1ITG1TNnJtY1Q1T3JWUFhNQjhHQTFVZEl3UVlNQmFBRkxoWi9hQWpMQ2RFMVkvY2I1MHZ1SExzNWtrTE1HTUdBMVVkSHdSY01Gb3dXS0JXb0ZTR1VtaDBkSEE2THk5bVpHa3VjMmx1Y0dVdVpta3VZM0l2Y21Wd2IzTnBkRzl5YVc4dlEwRWxNakJUU1U1UVJTVXlNQzBsTWpCUVJWSlRUMDVCSlRJd1NsVlNTVVJKUTBFbE1qQjJNaWd4S1M1amNtd3dnWm9HQ0NzR0FRVUZCd0VCQklHTk1JR0tNQ2dHQ0NzR0FRVUZCekFCaGh4b2RIUndPaTh2YjJOemNDNXphVzV3WlM1bWFTNWpjaTl2WTNOd01GNEdDQ3NHQVFVRkJ6QUNobEpvZEhSd09pOHZabVJwTG5OcGJuQmxMbVpwTG1OeUwzSmxjRzl6YVhSdmNtbHZMME5CSlRJd1UwbE9VRVVsTWpBdEpUSXdVRVZTVTA5T1FTVXlNRXBWVWtsRVNVTkJKVEl3ZGpJb01Ta3VZM0owTUR3R0NTc0dBUVFCZ2pjVkJ3UXZNQzBHSlNzR0FRUUJnamNWQ0lYRTZsdUMwZU0xbFpFYmd2bVhHSWFseTJ1QmY0R1Foblhlc2x3Q0FXUUNBUWt3RXdZRFZSMGxCQXd3Q2dZSUt3WUJCUVVIQXdRd0d3WUpLd1lCQkFHQ054VUtCQTR3RERBS0JnZ3JCZ0VGQlFjREJEQVZCZ05WSFNBRURqQU1NQW9HQ0dDQlBBRUJBUUVHTUEwR0NTcUdTSWIzRFFFQkN3VUFBNElCQVFBandxczJIQ3g5VnFMQ0hoaDNFdEZ2WnBqeDlEQ3hlY2xtb2w1ZzZTK21EclFKMklQK2wyR3ZibkRPekxrV1ozcTRrTG1GK084aGhXeENGM2hRNHJqSGgzc3l4TmpzVnpiVHVaeXUvaEVmeGI5VnpON3ZnckwvSFc5RC9yT0dzcXZDQmhxVTN3SkFhcmlia202cWNRb0I0MCtVY2w0dFZiaFVaMGIwejBid2FHRW1Gc1dTa21UemMwUmdpRzVlREozaDYzRGtubDNHdHZLaTZtaUhRaG1IUXJGanp3OERkeExhMTI0T1ppTlZ1b3NBS0Qxc1Jua3IrcXh2djEyb1FodnZIU2JOUVVmTVg4RlJBdERVSzN6VGU2aUJBWGpEZVV3ZFIwTkJPKzdwbWNCUXljS0pPSUVMZVFoSGNNeUpOL0dGSWVxZVkxNXB6UGM0NExMaTF5UTY8L2RzOlg1MDlDZXJ0aWZpY2F0ZT48L2RzOlg1MDlEYXRhPjwvZHM6S2V5SW5mbz48ZHM6T2JqZWN0Pjx4YWRlczpRdWFsaWZ5aW5nUHJvcGVydGllcyB4bWxuczp4YWRlcz0iaHR0cDovL3VyaS5ldHNpLm9yZy8wMTkwMy92MS4zLjIjIiBUYXJnZXQ9IiNpZC1iMWU2YmIzMTY1MjkwYWRlZTYyMTVjYmYxYThhMWUyNSI+PHhhZGVzOlNpZ25lZFByb3BlcnRpZXMgSWQ9InhhZGVzLWlkLWIxZTZiYjMxNjUyOTBhZGVlNjIxNWNiZjFhOGExZTI1Ij48eGFkZXM6U2lnbmVkU2lnbmF0dXJlUHJvcGVydGllcz48eGFkZXM6U2lnbmluZ1RpbWU+MjAyMS0wNS0wM1QyMTo1NjowNFo8L3hhZGVzOlNpZ25pbmdUaW1lPjx4YWRlczpTaWduaW5nQ2VydGlmaWNhdGU+PHhhZGVzOkNlcnQ+PHhhZGVzOkNlcnREaWdlc3Q+PGRzOkRpZ2VzdE1ldGhvZCBBbGdvcml0aG09Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvMDkveG1sZHNpZyNzaGExIi8+PGRzOkRpZ2VzdFZhbHVlPkhKSWdSa2diUG42cGFBMFBQMmQ1RmIwK1VMUT08L2RzOkRpZ2VzdFZhbHVlPjwveGFkZXM6Q2VydERpZ2VzdD48eGFkZXM6SXNzdWVyU2VyaWFsPjxkczpYNTA5SXNzdWVyTmFtZT5DTj1DQSBTSU5QRSAtIFBFUlNPTkEgSlVSSURJQ0EgdjIsT1U9RElWSVNJT04gU0lTVEVNQVMgREUgUEFHTyxPPUJBTkNPIENFTlRSQUwgREUgQ09TVEEgUklDQSxDPUNSLDIuNS40LjU9IzEzMTA0MzUwNGEyZDM0MmQzMDMwMzAyZDMwMzAzNDMwMzEzNzwvZHM6WDUwOUlzc3Vlck5hbWU+PGRzOlg1MDlTZXJpYWxOdW1iZXI+MTYwNTY1MzY1NzA3NDg2MDE0OTAzMTkyNjE3MjU1NDg4NDk4NzIzMDM1NTk5MTwvZHM6WDUwOVNlcmlhbE51bWJlcj48L3hhZGVzOklzc3VlclNlcmlhbD48L3hhZGVzOkNlcnQ+PC94YWRlczpTaWduaW5nQ2VydGlmaWNhdGU+PC94YWRlczpTaWduZWRTaWduYXR1cmVQcm9wZXJ0aWVzPjx4YWRlczpTaWduZWREYXRhT2JqZWN0UHJvcGVydGllcz48eGFkZXM6RGF0YU9iamVjdEZvcm1hdCBPYmplY3RSZWZlcmVuY2U9IiNyLWlkLTEiPjx4YWRlczpNaW1lVHlwZT5hcHBsaWNhdGlvbi9vY3RldC1zdHJlYW08L3hhZGVzOk1pbWVUeXBlPjwveGFkZXM6RGF0YU9iamVjdEZvcm1hdD48L3hhZGVzOlNpZ25lZERhdGFPYmplY3RQcm9wZXJ0aWVzPjwveGFkZXM6U2lnbmVkUHJvcGVydGllcz48L3hhZGVzOlF1YWxpZnlpbmdQcm9wZXJ0aWVzPjwvZHM6T2JqZWN0PjwvZHM6U2lnbmF0dXJlPjwvTWVuc2FqZUhhY2llbmRhPg==";
@Component({
  selector: 'app-crear-nota',
  templateUrl: './crear-nota.component.html',
  styleUrls: ['./crear-nota.component.css'],
  providers: [ServicioCaByS, ServicioUsuario, ServicioEscritorXML, ServicioDecodificador,
    ServicioEnvioXML, ServicioCertificado, ServicioFirmadoXML, ServicioClaveXML, DatePipe]
})
export class CrearNotaComponent implements OnInit {

  nombreEmisor = "";
  tipoIdentEmisor = "";
  cedulaEmisor = "";
  correoEmisor = "";
  telefonoEmisor = "";

  nombreReceptor = "";
  tipoIdentReceptor = "";
  cedulaReceptor = "";
  correoReceptor = "";
  telefonoReceptor = "";
  claveNueva = "";
  clave = "";
  fechaEmision = "";

  xml: string;

  public total_OtrosCargos: number;
  public impuestoTarifa: Map<string, number>;

  public lineas: Linea[] = [];
  public otrosCargos: OtroCargo[] = [];
  public datosXML: CreacionXML;

  public isCollapsedResumenData: boolean = true;

  cabys: { impuesto: string, descripcion: string, codigoBienServicio: string }[] = [];
  dataSourceResumen!: MatTableDataSource<Linea>;
  displayedColumnsResumen: string[] = ['productoLinea', 'cantidadProductoLinea', 'totalLinea'];

  constructor(
    public dialogRef: MatDialogRef<CrearNotaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { tipoNota: string, xml: string }, private _servicioCaByS: ServicioCaByS,
    private _servicioUsuario: ServicioUsuario, private _servicioEscritorXML: ServicioEscritorXML,
    private _servicioDecodificador: ServicioDecodificador, private _servicioEnvio: ServicioEnvioXML,
    private _servicioFirma: ServicioFirmadoXML, private _servicioCertificado: ServicioCertificado,
    public datepipe: DatePipe, private _servicioClave: ServicioClaveXML) {
    this.total_OtrosCargos = 0;
    this.impuestoTarifa = new Map();
    this.datosXML = new CreacionXML("genXML", "gen_xml_fe", "", "", new Date().toString(),
      this.nombreEmisor, "01", this.cedulaEmisor, "n/a",
      "1", "10", "04", "04", "Mi casa", "506", this.telefonoEmisor,
      "506", "00000000", this.correoEmisor, this.nombreReceptor, "", this.cedulaReceptor,
      "", "", "", "", "506", this.telefonoReceptor, "506", "", this.correoReceptor, "01", "0", "01", "CRC",
      "", "", "", "", "", "", "", "", "", "", "", "", "nada", "nada", "", "False");
    this.xml = data.xml;
    this.convertirXML()
      .then((res) => {
        var datos = JSON.parse(res);
        this.tipoIdentEmisor = datos.jsonData.FacturaElectronica.Emisor[0].Identificacion[0].Tipo[0]
        this.tipoIdentReceptor = datos.jsonData.FacturaElectronica.Receptor[0].Identificacion[0].Tipo[0]
        this.clave = datos.jsonData.FacturaElectronica.Clave[0]
        this.fechaEmision = datos.jsonData.FacturaElectronica.FechaEmision[0];
        this.nombreEmisor = datos.jsonData.FacturaElectronica.Emisor[0].Nombre;
        this.cedulaEmisor = datos.jsonData.FacturaElectronica.Emisor[0].Identificacion[0].Numero;
        this.correoEmisor = datos.jsonData.FacturaElectronica.Emisor[0].CorreoElectronico;
        this.telefonoEmisor = datos.jsonData.FacturaElectronica.Emisor[0].Telefono[0].NumTelefono;
        this.nombreReceptor = datos.jsonData.FacturaElectronica.Receptor[0].Nombre;
        this.cedulaReceptor = datos.jsonData.FacturaElectronica.Receptor[0].Identificacion[0].Numero;
        this.correoReceptor = datos.jsonData.FacturaElectronica.Receptor[0].CorreoElectronico;
        this.telefonoReceptor = datos.jsonData.FacturaElectronica.Receptor[0].Telefono[0].NumTelefono;
        this.lineas = [];
        var lineasJSON = datos.jsonData.FacturaElectronica.DetalleServicio;

        for (let index = 0; index < lineasJSON.length; index++) {
          const lineaJson = lineasJSON[index];
          //
          let linea = new Linea("", "", [{ descripcion: "", impuesto: "", codigoBienServicio: "" }], 0, "", 0, 0, "", "", false, 0, 0, 0, 0);
          linea.producto = lineaJson.LineaDetalle[0].Detalle[0];
          linea.codigo = lineaJson.LineaDetalle[0].Codigo[0];
          linea.filtro[0].descripcion = lineaJson.LineaDetalle[0].Detalle;
          linea.filtro[0].impuesto = lineaJson.LineaDetalle[0].Impuesto[0].Tarifa[0];
          linea.filtro[0].codigoBienServicio = lineaJson.LineaDetalle[0].Codigo;
          linea.cantidad = Number(lineaJson.LineaDetalle[0].Cantidad);
          linea.tipo = lineaJson.LineaDetalle[0].UnidadMedida[0];
          linea.precioUnitario = Number(lineaJson.LineaDetalle[0].PrecioUnitario);
          if (lineaJson.LineaDetalle[0].Descuento) {
            linea.descuento = Number(lineaJson.LineaDetalle[0].Descuento[0].MontoDescuento);
            linea.razon = lineaJson.LineaDetalle[0].Descuento[0].NaturalezaDescuento;
          }
          linea.base = Number(lineaJson.LineaDetalle[0].BaseImponible);
          linea.tarifa = Number(lineaJson.LineaDetalle[0].Impuesto[0].Tarifa);
          linea.subtotal = Number(lineaJson.LineaDetalle[0].SubTotal);
          linea.total = Number(lineaJson.LineaDetalle[0].MontoTotalLinea); //no se estan usando todos los campos del xml
          //
          console.log(linea)
          this.lineas.push(linea);
        }
        this.dataSourceResumen = new MatTableDataSource(this.lineas);

        this.otrosCargos = [];
        var cargosJSON = datos.jsonData.FacturaElectronica.OtrosCargos;
        if (cargosJSON) {
          for (let index = 0; index < cargosJSON.length; index++) {
            const cargoJSON = cargosJSON[index];

            let cargo = new OtroCargo("", "", 0, false, "", "", "", 0);
            cargo.tipoDocumento = cargoJSON.TipoDocumento[0];
            cargo.detalle = cargoJSON.Detalle[0];
            cargo.monto = Number(cargoJSON.Porcentaje[0]);
            cargo.total = Number(cargoJSON.MontoCargo[0]);
            if (cargo.total === cargo.monto) {
              cargo.porcentaje = true;
            }
            if (cargo.tipoDocumento === "04") {
              cargo.tipoIdentificacion = "01";
              cargo.identificacion = cargoJSON.NumeroIdentidadTercero[0];
              cargo.nombre = cargoJSON.NombreTercero[0];

            }
            this.otrosCargos.push(cargo);

          }
        }
        this.calcularTotales();
      })
      .catch((err) => {
        console.log(err);
      })
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

  enviarNota() {
    this.crearClave()
    .then((res) => {
      console.log(res.resp)
      this.claveNueva = res.resp.clave;
      this.crearNota()
      .then((res) => {
        this.xml = res.xmlencoded;
        this.firmar()
          .then((res) => {
            this.xml = res;
            this.enviar()
              .then((res) => { console.log(res) })
              .catch((err) => { console.error(err) })
          })
          .catch((err) => { console.error(err) })
      })
      .catch((err) => { console.error(err) })
    })
    .catch((err) => { console.error(err) })
    
    
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
    //console.log(this.total_OtrosCargos)
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
      console.log(cargo)
      this.total_OtrosCargos += cargo.total;
      console.log(this.total_OtrosCargos);
    });
  }

  nuevaLinea() {
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

  convertirXML(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._servicioUsuario.convertirXML(this.xml).subscribe(
        result => { resolve(JSON.stringify(result)); },
        err => { reject(err); }
      )
    })
  }

  crearClave(): Promise<any> {
    return new Promise((resolve, reject) => {
      let clave = new ClaveXML("clave","clave",this.tipoIdentEmisor,this.cedulaEmisor,
      "normal","506","010002375","98862261",this.data.tipoNota);
      this._servicioClave.crearClaveXML(clave).subscribe(
        result => { resolve(result); },
        err => { reject(err); }
      )
    })
  }

  crearNota(): Promise<any> {
    let data = { tipoDoc: '01', numero: this.clave, fechaEmision: this.fechaEmision, codigo: '02', razon: "Corrige Monto" }
    return new Promise((resolve, reject) => {
      this._servicioDecodificador.decodificarXML(this.xml).subscribe(
        result1 => {
          let fecha = this.datepipe.transform(new Date(), 'yyyy-MM-ddThh:mm:ssZZZZZ');
          
          this._servicioEscritorXML.crearNota(result1.xmlDecoded, this.data.tipoNota, data, this.claveNueva , fecha?fecha:"").subscribe(
            result2 => {
              this._servicioDecodificador.codificarXML(result2.xmlFile).subscribe(
                res => { resolve(res); },
                err => { reject(err); }
              )
            },
            err => { reject(err); }
          )
        },
        err => { reject(err); }
      )

    })
  }

  firmar(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._servicioCertificado.getCertificado("2").subscribe(
        result => {
          let certificado: Certificado = result;
          let firma = new FirmadoXML("signXML", "signFE", certificado.archivo, this.xml, certificado.pin, this.data.tipoNota)
          this._servicioFirma.firmarFEXML(firma).subscribe(
            res => { resolve(res.resp.xmlFirmado); },
            err => { reject(err); }
          )
        },
        error => { reject(error); });
    });

  }

  enviar(): Promise<any> {
    return new Promise((resolve, reject) => {
      let token = localStorage.getItem("token")
      let envio = new EnvioXML("send", "json", token ? token : "", this.claveNueva, this.fechaEmision,
        this.tipoIdentEmisor, this.cedulaEmisor, this.tipoIdentReceptor,
        this.cedulaReceptor, this.xml, "api-stag");
      console.log(envio);
      this._servicioEnvio.enviarFEXML(envio).subscribe(
        res => { resolve(res); },
        err => { reject(err); }
      )
    });
  }

  enviar2(): Promise<any> {
    return new Promise((resolve, reject) => {
      let token = localStorage.getItem("token")
      let envio = new EnvioXML("send", "json", token ? token : "", "5061305180007023207170010000101152277340310775634", "2018-05-13T13:00-06:00",
      "01", "702320717", "01", "702320717", XML, "api-stag");
      this._servicioEnvio.enviarFEXML(envio).subscribe(
        res => { resolve(res); 
                console.log(res)},
        err => { reject(err) }
      )
    })
  }

}
