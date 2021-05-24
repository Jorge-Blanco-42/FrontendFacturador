import { Component, OnInit, Inject, ViewChild, Injectable } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Linea } from 'src/app/models/linea';
import { OtroCargo } from 'src/app/models/otroCargo';
import { ServicioCorreo } from 'src/app/services/correo';
import { Correo } from 'src/app/models/correo';
import { CrearNotaComponent } from '../crear-nota/crear-nota.component';
import { ServicioUsuario } from 'src/app/services/usuarioCRLibre';
import { ClaveXML } from 'src/app/models/claveXML';
import { Certificado } from 'src/app/models/certificado';
import { FirmadoXML } from 'src/app/models/firmadoXML';
import { EnvioXML } from 'src/app/models/envioXML';
import { ServicioEscritorXML } from 'src/app/services/escritorXML';
import { ServicioDecodificador } from 'src/app/services/decodificador';
import { ServicioEnvioXML } from 'src/app/services/envioXML';
import { DatePipe } from '@angular/common';
import { ServicioCertificado } from 'src/app/services/certificado';
import { ServicioClaveXML } from 'src/app/services/claveXML';
import { ServicioFirmadoXML } from 'src/app/services/firmadoXML';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const XML = "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48TWVuc2FqZUhhY2llbmRhIHhtbG5zPSJodHRwczovL2Nkbi5jb21wcm9iYW50ZXNlbGVjdHJvbmljb3MuZ28uY3IveG1sLXNjaGVtYXMvdjQuMy9tZW5zYWplSGFjaWVuZGEiPgogICAgPENsYXZlPjUwNjAzMDUyMTAwMDExNzUxMDE2OTAwMTAwMDAxMDEwMTAwMDEyMzczMTk4NzYyMjU5PC9DbGF2ZT4KICAgIDxOb21icmVFbWlzb3I+REVTQ09OT0NJRE88L05vbWJyZUVtaXNvcj4KICAgIDxUaXBvSWRlbnRpZmljYWNpb25FbWlzb3I+MDE8L1RpcG9JZGVudGlmaWNhY2lvbkVtaXNvcj4KICAgIDxOdW1lcm9DZWR1bGFFbWlzb3I+MTE3NTEwMTY5PC9OdW1lcm9DZWR1bGFFbWlzb3I+CiAgICA8VGlwb0lkZW50aWZpY2FjaW9uUmVjZXB0b3I+MDE8L1RpcG9JZGVudGlmaWNhY2lvblJlY2VwdG9yPgogICAgPE51bWVyb0NlZHVsYVJlY2VwdG9yPjExNzE3MDI0MjwvTnVtZXJvQ2VkdWxhUmVjZXB0b3I+CiAgICA8TWVuc2FqZT4zPC9NZW5zYWplPgogICAgPERldGFsbGVNZW5zYWplPkVzdGUgY29tcHJvYmFudGUgZnVlIGFjZXB0YWRvIGVuIGVsIGFtYmllbnRlIGRlIHBydWViYXMsIHBvciBsbyBjdWFsIG5vIHRpZW5lIHZhbGlkZXogcGFyYSBmaW5lcyB0cmlidXRhcmlvcwoKRWwgY29tcHJvYmFudGUgZWxlY3Ryw7NuaWNvIHRpZW5lIGxvcyBzaWd1aWVudGVzIGVycm9yZXM6IApbCkxhIGZpcm1hIGRlbCBjb21wcm9iYW50ZSBlbGVjdHLDs25pY28gbm8gZXMgdsOhbGlkYSAoRWwgWE1MIGZ1ZSBtb2RpZmljYWRvIGx1ZWdvIGRlIGhhYmVyIHNpZG8gZmlybWFkbykuCl08L0RldGFsbGVNZW5zYWplPgogICAgPFRvdGFsRmFjdHVyYT4wPC9Ub3RhbEZhY3R1cmE+CjxkczpTaWduYXR1cmUgeG1sbnM6ZHM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvMDkveG1sZHNpZyMiIElkPSJpZC1iMWU2YmIzMTY1MjkwYWRlZTYyMTVjYmYxYThhMWUyNSI+PGRzOlNpZ25lZEluZm8+PGRzOkNhbm9uaWNhbGl6YXRpb25NZXRob2QgQWxnb3JpdGhtPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzEwL3htbC1leGMtYzE0biMiLz48ZHM6U2lnbmF0dXJlTWV0aG9kIEFsZ29yaXRobT0iaHR0cDovL3d3dy53My5vcmcvMjAwMS8wNC94bWxkc2lnLW1vcmUjcnNhLXNoYTI1NiIvPjxkczpSZWZlcmVuY2UgSWQ9InItaWQtMSIgVHlwZT0iIiBVUkk9IiI+PGRzOlRyYW5zZm9ybXM+PGRzOlRyYW5zZm9ybSBBbGdvcml0aG09Imh0dHA6Ly93d3cudzMub3JnL1RSLzE5OTkvUkVDLXhwYXRoLTE5OTkxMTE2Ij48ZHM6WFBhdGg+bm90KGFuY2VzdG9yLW9yLXNlbGY6OmRzOlNpZ25hdHVyZSk8L2RzOlhQYXRoPjwvZHM6VHJhbnNmb3JtPjxkczpUcmFuc2Zvcm0gQWxnb3JpdGhtPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzEwL3htbC1leGMtYzE0biMiLz48L2RzOlRyYW5zZm9ybXM+PGRzOkRpZ2VzdE1ldGhvZCBBbGdvcml0aG09Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvMDQveG1sZW5jI3NoYTI1NiIvPjxkczpEaWdlc3RWYWx1ZT5ibHZ2UXBhdFN4RlpVeUp2UEpPVW9jTEpDN24yVDRSOGNsZVI4eW9TNHp3PTwvZHM6RGlnZXN0VmFsdWU+PC9kczpSZWZlcmVuY2U+PGRzOlJlZmVyZW5jZSBUeXBlPSJodHRwOi8vdXJpLmV0c2kub3JnLzAxOTAzI1NpZ25lZFByb3BlcnRpZXMiIFVSST0iI3hhZGVzLWlkLWIxZTZiYjMxNjUyOTBhZGVlNjIxNWNiZjFhOGExZTI1Ij48ZHM6VHJhbnNmb3Jtcz48ZHM6VHJhbnNmb3JtIEFsZ29yaXRobT0iaHR0cDovL3d3dy53My5vcmcvMjAwMS8xMC94bWwtZXhjLWMxNG4jIi8+PC9kczpUcmFuc2Zvcm1zPjxkczpEaWdlc3RNZXRob2QgQWxnb3JpdGhtPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGVuYyNzaGEyNTYiLz48ZHM6RGlnZXN0VmFsdWU+QWtwN0tiM2VYdzlmRzEzb0Q2dFdHKzNEWU50aDRyd3EwM21kWWpjK0MxMD08L2RzOkRpZ2VzdFZhbHVlPjwvZHM6UmVmZXJlbmNlPjwvZHM6U2lnbmVkSW5mbz48ZHM6U2lnbmF0dXJlVmFsdWUgSWQ9InZhbHVlLWlkLWIxZTZiYjMxNjUyOTBhZGVlNjIxNWNiZjFhOGExZTI1Ij5hOWFBSnVyWnk0UEhkVld4TzdCd2FDNEQ2UC9oRTJnUEFkM2ZPUUpCOVNZaXVqV0M4RHduMHZ2aS9hMVZwV0Z5V1BaNUVoL3dJU0ZwSnRCc0k1L3E0VEh1T29vY0x4Slo2SDB2RkhTU1d6MldvcjJIUUgyVDQyTGFJRlhOZUlXOHNyVWxwTEN0dFpMbnlDOXhTZVdzOG5hVGVVczdHSVA2aTNtcCtNOGtmSDBzaU16eUhtK3pGMy9kTWd0Z2JwcVdIWWt0Sm91cEJ2bDZyNjZMS2JEZmxZWWdGcGJBRjRCeFd0akdCVVBaSTVLK25GTG16TzF5cXpEYmw2b2FIUEFZcitBQ040MERteGZ3TXdQc082TUtkTkJ6OTZpeXVvMmVYZ3NhKzZYcmFveWdvSnhBSXRISVdaKzlMZEhlcVFDQnFudzdldThxQVJTUUNjbnVqUEZVd0E9PTwvZHM6U2lnbmF0dXJlVmFsdWU+PGRzOktleUluZm8+PGRzOlg1MDlEYXRhPjxkczpYNTA5Q2VydGlmaWNhdGU+TUlJRmh6Q0NCRytnQXdJQkFnSVRTQUFBQWhlSTQrVi9oaVVrN1FBQkFBQUNGekFOQmdrcWhraUc5dzBCQVFzRkFEQ0JtekVaTUJjR0ExVUVCUk1RUTFCS0xUUXRNREF3TFRBd05EQXhOekVMTUFrR0ExVUVCaE1DUTFJeEpEQWlCZ05WQkFvVEcwSkJUa05QSUVORlRsUlNRVXdnUkVVZ1EwOVRWRUVnVWtsRFFURWlNQ0FHQTFVRUN4TVpSRWxXU1ZOSlQwNGdVMGxUVkVWTlFWTWdSRVVnVUVGSFR6RW5NQ1VHQTFVRUF4TWVRMEVnVTBsT1VFVWdMU0JRUlZKVFQwNUJJRXBWVWtsRVNVTkJJSFl5TUI0WERURTVNVEl5TXpFM05ETXhObG9YRFRJek1USXlNakUzTkRNeE5sb3dmekVaTUJjR0ExVUVCUk1RUTFCS0xUSXRNVEF3TFRBME1qQXdOVEVMTUFrR0ExVUVCaE1DUTFJeEdUQVhCZ05WQkFvVEVGQkZVbE5QVGtFZ1NsVlNTVVJKUTBFeE9qQTRCZ05WQkFNVE1VVlRWRUZFVHkxTlNVNUpVMVJGVWtsUElFUkZJRWhCUTBsRlRrUkJJQ2hUUlV4TVR5QkZURVZEVkZKUFRrbERUeWt3Z2dFaU1BMEdDU3FHU0liM0RRRUJBUVVBQTRJQkR3QXdnZ0VLQW9JQkFRRGtuSExyZUhPTUJUY0s0MnBUSDZDbVFQRTZncGY3VTdSdnNzWjNmMjR4akxxajdLL1huVkkzdEZrcW50a21wMmVNK2lYeXMxQXlzS3g3QURRQlB2NWdOZWlHQzVkTkRtNEY5RXBJbSthLzJmcFU3dE5HdnhSQ281RHFZMG1lREhJa0ZlUkZObHladTR4aFVjNWZqWVNQczkxKytkOCtjcnpiSUlabElQNHh3czNKOTJiZU44Z3U5YWRreHQ0VmhBbmdtN0RVN2dwWVlBLy9DSkZvL05aTWtaYUwrbVBxUTJ2SHB6SW9SWSsvcGxzbzhvL25UREJLejVzcHJLYjJzbTRYQTRzczd4NHRoaXhTblVoOEdxNVl5SlQzOTR0bkJtWGd4TmtrSm5kUHczTXpJay91Mm5WNlozY0VYbkpHN3ZPOVdMb09vMTFiK0REdlpYZm54MEhUQWdNQkFBR2pnZ0hkTUlJQjJUQU9CZ05WSFE4QkFmOEVCQU1DQnNBd0hRWURWUjBPQkJZRUZKR0EzOGE0SkdCSG1ITG1TNnJtY1Q1T3JWUFhNQjhHQTFVZEl3UVlNQmFBRkxoWi9hQWpMQ2RFMVkvY2I1MHZ1SExzNWtrTE1HTUdBMVVkSHdSY01Gb3dXS0JXb0ZTR1VtaDBkSEE2THk5bVpHa3VjMmx1Y0dVdVpta3VZM0l2Y21Wd2IzTnBkRzl5YVc4dlEwRWxNakJUU1U1UVJTVXlNQzBsTWpCUVJWSlRUMDVCSlRJd1NsVlNTVVJKUTBFbE1qQjJNaWd4S1M1amNtd3dnWm9HQ0NzR0FRVUZCd0VCQklHTk1JR0tNQ2dHQ0NzR0FRVUZCekFCaGh4b2RIUndPaTh2YjJOemNDNXphVzV3WlM1bWFTNWpjaTl2WTNOd01GNEdDQ3NHQVFVRkJ6QUNobEpvZEhSd09pOHZabVJwTG5OcGJuQmxMbVpwTG1OeUwzSmxjRzl6YVhSdmNtbHZMME5CSlRJd1UwbE9VRVVsTWpBdEpUSXdVRVZTVTA5T1FTVXlNRXBWVWtsRVNVTkJKVEl3ZGpJb01Ta3VZM0owTUR3R0NTc0dBUVFCZ2pjVkJ3UXZNQzBHSlNzR0FRUUJnamNWQ0lYRTZsdUMwZU0xbFpFYmd2bVhHSWFseTJ1QmY0R1Foblhlc2x3Q0FXUUNBUWt3RXdZRFZSMGxCQXd3Q2dZSUt3WUJCUVVIQXdRd0d3WUpLd1lCQkFHQ054VUtCQTR3RERBS0JnZ3JCZ0VGQlFjREJEQVZCZ05WSFNBRURqQU1NQW9HQ0dDQlBBRUJBUUVHTUEwR0NTcUdTSWIzRFFFQkN3VUFBNElCQVFBandxczJIQ3g5VnFMQ0hoaDNFdEZ2WnBqeDlEQ3hlY2xtb2w1ZzZTK21EclFKMklQK2wyR3ZibkRPekxrV1ozcTRrTG1GK084aGhXeENGM2hRNHJqSGgzc3l4TmpzVnpiVHVaeXUvaEVmeGI5VnpON3ZnckwvSFc5RC9yT0dzcXZDQmhxVTN3SkFhcmlia202cWNRb0I0MCtVY2w0dFZiaFVaMGIwejBid2FHRW1Gc1dTa21UemMwUmdpRzVlREozaDYzRGtubDNHdHZLaTZtaUhRaG1IUXJGanp3OERkeExhMTI0T1ppTlZ1b3NBS0Qxc1Jua3IrcXh2djEyb1FodnZIU2JOUVVmTVg4RlJBdERVSzN6VGU2aUJBWGpEZVV3ZFIwTkJPKzdwbWNCUXljS0pPSUVMZVFoSGNNeUpOL0dGSWVxZVkxNXB6UGM0NExMaTF5UTY8L2RzOlg1MDlDZXJ0aWZpY2F0ZT48L2RzOlg1MDlEYXRhPjwvZHM6S2V5SW5mbz48ZHM6T2JqZWN0Pjx4YWRlczpRdWFsaWZ5aW5nUHJvcGVydGllcyB4bWxuczp4YWRlcz0iaHR0cDovL3VyaS5ldHNpLm9yZy8wMTkwMy92MS4zLjIjIiBUYXJnZXQ9IiNpZC1iMWU2YmIzMTY1MjkwYWRlZTYyMTVjYmYxYThhMWUyNSI+PHhhZGVzOlNpZ25lZFByb3BlcnRpZXMgSWQ9InhhZGVzLWlkLWIxZTZiYjMxNjUyOTBhZGVlNjIxNWNiZjFhOGExZTI1Ij48eGFkZXM6U2lnbmVkU2lnbmF0dXJlUHJvcGVydGllcz48eGFkZXM6U2lnbmluZ1RpbWU+MjAyMS0wNS0wM1QyMTo1NjowNFo8L3hhZGVzOlNpZ25pbmdUaW1lPjx4YWRlczpTaWduaW5nQ2VydGlmaWNhdGU+PHhhZGVzOkNlcnQ+PHhhZGVzOkNlcnREaWdlc3Q+PGRzOkRpZ2VzdE1ldGhvZCBBbGdvcml0aG09Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvMDkveG1sZHNpZyNzaGExIi8+PGRzOkRpZ2VzdFZhbHVlPkhKSWdSa2diUG42cGFBMFBQMmQ1RmIwK1VMUT08L2RzOkRpZ2VzdFZhbHVlPjwveGFkZXM6Q2VydERpZ2VzdD48eGFkZXM6SXNzdWVyU2VyaWFsPjxkczpYNTA5SXNzdWVyTmFtZT5DTj1DQSBTSU5QRSAtIFBFUlNPTkEgSlVSSURJQ0EgdjIsT1U9RElWSVNJT04gU0lTVEVNQVMgREUgUEFHTyxPPUJBTkNPIENFTlRSQUwgREUgQ09TVEEgUklDQSxDPUNSLDIuNS40LjU9IzEzMTA0MzUwNGEyZDM0MmQzMDMwMzAyZDMwMzAzNDMwMzEzNzwvZHM6WDUwOUlzc3Vlck5hbWU+PGRzOlg1MDlTZXJpYWxOdW1iZXI+MTYwNTY1MzY1NzA3NDg2MDE0OTAzMTkyNjE3MjU1NDg4NDk4NzIzMDM1NTk5MTwvZHM6WDUwOVNlcmlhbE51bWJlcj48L3hhZGVzOklzc3VlclNlcmlhbD48L3hhZGVzOkNlcnQ+PC94YWRlczpTaWduaW5nQ2VydGlmaWNhdGU+PC94YWRlczpTaWduZWRTaWduYXR1cmVQcm9wZXJ0aWVzPjx4YWRlczpTaWduZWREYXRhT2JqZWN0UHJvcGVydGllcz48eGFkZXM6RGF0YU9iamVjdEZvcm1hdCBPYmplY3RSZWZlcmVuY2U9IiNyLWlkLTEiPjx4YWRlczpNaW1lVHlwZT5hcHBsaWNhdGlvbi9vY3RldC1zdHJlYW08L3hhZGVzOk1pbWVUeXBlPjwveGFkZXM6RGF0YU9iamVjdEZvcm1hdD48L3hhZGVzOlNpZ25lZERhdGFPYmplY3RQcm9wZXJ0aWVzPjwveGFkZXM6U2lnbmVkUHJvcGVydGllcz48L3hhZGVzOlF1YWxpZnlpbmdQcm9wZXJ0aWVzPjwvZHM6T2JqZWN0PjwvZHM6U2lnbmF0dXJlPjwvTWVuc2FqZUhhY2llbmRhPg==";

const LINEAS: Linea[] = JSON.parse('[{"producto":"Aguacate nabal, fresco o refrigerado","codigo":"0131100020500","filtro":[{"impuesto":"1%","descripcion":"Aguacate nabal, fresco o refrigerado","codigoBienServicio":"0131100020500"}],"cantidad":7,"tipo":"Unid","precioUnitario":750,"descuento":1000,"razon":"","impuesto":"01-02","porcentaje":false,"base":0,"tarifa":1.01,"subtotal":5250,"total":4302.5},{"producto":"Chocolate con leche, en bloques, barras o tabletas (que contengan más del 50% del peso en bruto en cacao)","codigo":"2366000000300","filtro":[{"impuesto":"13%","descripcion":"Chocolate con leche, en bloques, barras o tabletas (que contengan más del 50% del peso en bruto en cacao)","codigoBienServicio":"2366000000300"}],"cantidad":6,"tipo":"Unid","precioUnitario":1100,"descuento":0,"razon":"","impuesto":"01-08","porcentaje":false,"base":0,"tarifa":1.13,"subtotal":6600,"total":7457.999999999999},{"producto":"Limones y limas, frescos o refrigerados, n.c.p.","codigo":"0132200009900","filtro":[{"impuesto":"13%","descripcion":"Limones y limas, frescos o refrigerados, n.c.p.","codigoBienServicio":"0132200009900"}],"cantidad":5,"tipo":"Unid","precioUnitario":500,"descuento":0,"razon":"","impuesto":"01-08","porcentaje":false,"base":0,"tarifa":1.13,"subtotal":2500,"total":2824.9999999999995},{"producto":"Mango verde, fresco o refrigerado","codigo":"0131601021700","filtro":[{"impuesto":"1%","descripcion":"Mango verde, fresco o refrigerado","codigoBienServicio":"0131601021700"}],"cantidad":4,"tipo":"Unid","precioUnitario":450,"descuento":0,"razon":"","impuesto":"01-02","porcentaje":false,"base":0,"tarifa":1.01,"subtotal":1800,"total":1818}]');

const OTROS_CARGOS: OtroCargo[] = JSON.parse('[{"tipoDocumento":"04","detalle":"Propina","monto":1000,"porcentaje":false,"tipoIdentificacion":"01","identificacion":"117510169","nombre":"Jorge Blanco","total":1000},{"tipoDocumento":"06","detalle":"Servicio de envio","monto":10,"porcentaje":true,"tipoIdentificacion":"","identificacion":"","nombre":"","total":1500}]');

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
  // { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  // { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  // { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  // { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  // { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  // { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  // { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  // { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  // { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  // { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];


//(click)="openDialog()"
@Component({
  selector: 'app-consultar',
  templateUrl: './consultar.component.html',
  styleUrls: ['./consultar.component.css'],
  providers: [ServicioUsuario]
})
export class ConsultarComponent implements OnInit {

  columnasFactura: string[] = ['fecha', 'receptor', 'numeroConsecutivo', 'claveDocumento', 'tipoDocumento', 'notaCredito', 'notaDebito', 'enviarCorreo', 'anular'];
  facturas: { fecha: string, nombreComercial: string, numeroConsecutivo: string, claveDocumento: string, tipoDocumento: string, xml: string }[] = [];
  datosFacturas!: MatTableDataSource<{ fecha: string; nombreComercial: string; numeroConsecutivo: string; claveDocumento: string; tipoDocumento: string; xml: string; }>;
  private paginator!: MatPaginator;
  private sorter!: MatSort;

  @ViewChild('documentosPaginator') set matPaginator(mp: MatPaginator) {
    this.paginator = mp;

  }

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sorter = ms;

  }

  constructor(public dialog: MatDialog, private _servicioUsuario: ServicioUsuario) {
    this.cargarDocumentos()
      .then((res) => {
        let documentos = JSON.parse(res);
        documentos.docs.forEach((doc: {
          claveDocumento: string; fechaDocumento: string; xml: string,
          IDTipoDocumento: number, nombreReceptor: string
        }) => {
          let clave: string = doc.claveDocumento;
          let consecutivo = clave.substr(21, 20);
          let tipoDocumento = "";
          if (doc.IDTipoDocumento === 1) tipoDocumento = "Factura Electrónica";
          else if (doc.IDTipoDocumento === 2) tipoDocumento = "Nota de débito";
          else if (doc.IDTipoDocumento === 3) tipoDocumento = "Nota de crébito";
          else if (doc.IDTipoDocumento === 4) tipoDocumento = "Tiquete Electrónico";
          this.facturas.push({
            fecha: doc.fechaDocumento.substr(0, 10), nombreComercial: doc.nombreReceptor,
            numeroConsecutivo: consecutivo, claveDocumento: clave, tipoDocumento: tipoDocumento, xml: doc.xml
          });
        });
        this.datosFacturas = new MatTableDataSource(this.facturas);
        this.setPaginator();
        this.setSorter();
      })
      .catch((err) => { console.error(err) })
  }



  setPaginator() {
    if (this.paginator) {
      this.datosFacturas.paginator = this.paginator;
    }
  }

  setSorter() {
    if (this.sorter) {
      this.datosFacturas.sort = this.sorter;
    }
  }

  ngOnInit(): void {

  }


  cargarDocumentos(): Promise<string> {
    return new Promise((resolve, reject) => {
      this._servicioUsuario.getDocumentos("1").subscribe(
        result => { resolve(JSON.stringify(result)); },
        err => { reject(err); }
      )
    })
  }

  openDialogAnular(xml: string): void {
    const dialogRef = this.dialog.open(DialogResumen, {
      width: '80%',
      height: '70%',
      data: {
        anular: true,
        xml: xml
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  openDialogCorreo(xml: string): void {
    const dialogRef = this.dialog.open(DialogResumen, {
      width: '80%',
      height: '70%',
      data: {
        anular: false,
        xml: xml
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  openDialogNota(tipoNota: string, xml:string): void {
    const dialogRef = this.dialog.open(CrearNotaComponent, {
      width: '80%',
      height: '80%',
      data: {
        tipoNota: tipoNota,
        xml: xml
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.datosFacturas.filter = filterValue.trim().toLowerCase();
  }

  crearNotaCredito(element: any) {
    this.openDialogNota("NC", element.xml);
  }

  crearNotaDebito(element: any) {
    this.openDialogNota("ND", element.xml);
  }

  EnviarCorreo(element: any) {
    this.openDialogCorreo(element.xml);
  }

  anularFactura(element: any) {
    this.openDialogAnular(element.xml);
  }

}

@Component({
  selector: 'app-anular',
  templateUrl: './anular.component.html',
  providers: [ServicioUsuario, ServicioEscritorXML, ServicioDecodificador,
    ServicioEnvioXML, ServicioCertificado, ServicioFirmadoXML, ServicioClaveXML, DatePipe,
    ServicioCorreo, ServicioUsuario]
})
export class DialogResumen implements OnInit {

  displayedColumnsLineas: string[] = ['Producto', 'Cantidad', 'PrecioUnitario', 'Descuento', 'Impuestos', 'Subtotal', 'Total'];
  displayedColumnsCargo: string[] = ['TipoDocumento', 'Detalle', 'PorcentajeMonto', 'MontoCargo'];
  datosFactura!: MatTableDataSource<Linea>;
  datosCargo!: MatTableDataSource<OtroCargo>;
  private paginatorLineas!: MatPaginator;
  private paginatorCargos!: MatPaginator;
  checkEmisor: boolean = false;
  checkReceptor: boolean = false;
  checkOtro: boolean = false;
  otraDireccion: string = "";
  xml: string;
  anular: boolean;

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
  fecha: string | null = "";

  constructor(
    public dialogRef: MatDialogRef<DialogResumen>,
    @Inject(MAT_DIALOG_DATA) public data: { anular: boolean, xml: string }, private _servicioCorreo: ServicioCorreo,
    private _servicioUsuario: ServicioUsuario, private _servicioEscritorXML: ServicioEscritorXML,
    private _servicioDecodificador: ServicioDecodificador, private _servicioEnvio: ServicioEnvioXML,
    private _servicioFirma: ServicioFirmadoXML, private _servicioCertificado: ServicioCertificado,
    public datepipe: DatePipe, private _servicioClave: ServicioClaveXML) {
    this.anular = data.anular;
    this.xml = data.xml;
    this.convertirXML()
      .then((res) => {
        var datos = JSON.parse(res);
        this.tipoIdentEmisor = datos.jsonData.FacturaElectronica.Emisor[0].Identificacion[0].Tipo[0];
        this.tipoIdentReceptor = datos.jsonData.FacturaElectronica.Receptor[0].Identificacion[0].Tipo[0];
        this.clave = datos.jsonData.FacturaElectronica.Clave[0];
        this.nombreEmisor = datos.jsonData.FacturaElectronica.Emisor[0].Nombre[0];
        this.cedulaEmisor = datos.jsonData.FacturaElectronica.Emisor[0].Identificacion[0].Numero[0];
        this.correoEmisor = datos.jsonData.FacturaElectronica.Emisor[0].CorreoElectronico[0];
        this.telefonoEmisor = datos.jsonData.FacturaElectronica.Emisor[0].Telefono[0].NumTelefono[0];
        this.nombreReceptor = datos.jsonData.FacturaElectronica.Receptor[0].Nombre[0];
        this.cedulaReceptor = datos.jsonData.FacturaElectronica.Receptor[0].Identificacion[0].Numero[0];
        this.correoReceptor = datos.jsonData.FacturaElectronica.Receptor[0].CorreoElectronico[0];
        this.telefonoReceptor = datos.jsonData.FacturaElectronica.Receptor[0].Telefono[0].NumTelefono[0];
        var lineas: Linea[] = [];
        var lineasJSON = datos.jsonData.FacturaElectronica.DetalleServicio;

        for (let index = 0; index < lineasJSON.length; index++) {
          const lineaJson = lineasJSON[index];
          //
          let linea = new Linea("", "", [{ descripcion: "", impuesto: "", codigoBienServicio: "" }], 0, "", 0, 0, "", "", false, 0, 0, 0, 0);
          linea.producto = lineaJson.LineaDetalle[0].Detalle[0];
          linea.codigo = lineaJson.LineaDetalle[0].Codigo[0];
          linea.filtro[0].descripcion = lineaJson.LineaDetalle[0].Detalle[0];
          linea.filtro[0].impuesto = lineaJson.LineaDetalle[0].Impuesto[0].Tarifa[0];
          linea.filtro[0].codigoBienServicio = lineaJson.LineaDetalle[0].Codigo[0];
          linea.cantidad = Number(lineaJson.LineaDetalle[0].Cantidad);
          linea.tipo = lineaJson.LineaDetalle[0].UnidadMedida[0];
          linea.precioUnitario = Number(lineaJson.LineaDetalle[0].PrecioUnitario[0]);
          if (lineaJson.LineaDetalle[0].Descuento) {
            linea.descuento = Number(lineaJson.LineaDetalle[0].Descuento[0].MontoDescuento[0]);
            linea.razon = lineaJson.LineaDetalle[0].Descuento[0].NaturalezaDescuento[0];
          }
          if(lineaJson.LineaDetalle[0].BaseImponible)
            linea.base = Number(lineaJson.LineaDetalle[0].BaseImponible[0]);
          linea.tarifa = Number(lineaJson.LineaDetalle[0].Impuesto[0].Tarifa[0]);
          linea.subtotal = Number(lineaJson.LineaDetalle[0].SubTotal[0]);
          linea.total = Number(lineaJson.LineaDetalle[0].MontoTotalLinea[0]); //no se estan usando todos los campos del xml
          //
          lineas.push(linea);
        }

        var cargos: OtroCargo[] = [];
        var cargosJSON = datos.jsonData.FacturaElectronica.OtrosCargos;
        if (cargosJSON) {
          for (let index = 0; index < cargosJSON.length; index++) {
            const cargoJSON = cargosJSON[index];

            let cargo = new OtroCargo("", "", 0, false, "", "", "", 0);
            cargo.tipoDocumento = cargoJSON.TipoDocumento[0];
            cargo.detalle = cargoJSON.Detalle[0];
            cargo.monto = cargoJSON.Porcentaje[0];
            cargo.total = cargoJSON.MontoCargo[0];
            if(cargo.total === cargo.monto){
              cargo.porcentaje = true;
            }
            if (cargo.tipoDocumento === "04") {
              cargo.tipoIdentificacion = "01";
              cargo.identificacion = cargoJSON.NumeroIdentidadTercero;[0]
              cargo.nombre = cargoJSON.NombreTercero[0];
              
            }
            cargos.push(cargo);
          }
        }

        this.datosCargo = new MatTableDataSource(cargos);
        this.datosFactura = new MatTableDataSource(lineas);
        this.setPaginatorLineas();
        this.setPaginatorCargos();
      })
      .catch((err) => {
        console.log(err);
      })
  }

  @ViewChild('lineasPaginator') set matPaginatorLineas(mp: MatPaginator) {
    this.paginatorLineas = mp;
  }

  @ViewChild('cargosPaginator') set matPaginatorCargos(mp: MatPaginator) {
    this.paginatorCargos = mp;

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  setPaginatorLineas() {
    if (this.paginatorLineas) {
      this.datosFactura.paginator = this.paginatorLineas;
    }
  }

  setPaginatorCargos() {
    if (this.paginatorCargos) {
      this.datosCargo.paginator = this.paginatorCargos;
    }
  }
  
  AnularDocumento(){
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
              .then((res) => { 
                this.dialogRef.close();
                console.log(res) })
              .catch((err) => { console.error(err) })
          })
          .catch((err) => { console.error(err) })
      })
      .catch((err) => { console.error(err) })
    })
    .catch((err) => { console.error(err) })
    
    
  }

  enviarCorreo() {
    let correo: Correo = new Correo("", "Factura electrónica " + this.nombreEmisor, "Se adjunta factura eléctronica",
      "Factura.xml", this.xml, "", "base64");//PONER EL XML DEL MENSAJE DE ACEPTACION
    if (this.checkEmisor) {
      correo.to = this.correoEmisor;
      console.log(correo);
      this.enviarC(correo);
    }
    if (this.checkReceptor) {
      correo.to = this.correoReceptor;
      console.log(correo);
      this.enviarC(correo);
    }
    if (this.checkOtro) {
      correo.to = this.otraDireccion;
      console.log(correo);
      this.enviarC(correo);
    }
    this.dialogRef.close();
  }

  enviarC(correo: Correo) {
    this._servicioCorreo.enviarCorreo(correo).subscribe(
      res => {
        console.log("correo enviado");
      },
      error => {
        console.log("No se pudo enviar el correo");
      }
    );
  }

  convertirXML(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._servicioUsuario.convertirXML(this.xml).subscribe(
        result => { resolve(JSON.stringify(result)); },
        err => { reject(err); }
      )
    })
  }

  tipoDocumento(tipo: string): string{
    if(tipo === "06"){
      return "Impuesto de servicio 10%"
    }else if(tipo === "04"){
      return "Cobro a terceros"
    }else{
      return "Otros"
    }
  }

  crearClave(): Promise<any> {
    return new Promise((resolve, reject) => {
      let clave = new ClaveXML("clave","clave",this.tipoIdentEmisor,this.cedulaEmisor,
      "normal","506","010012376","99862262","ND");
      this._servicioClave.crearClaveXML(clave).subscribe(
        result => { resolve(result); },
        err => { reject(err); }
      )
    })
  }

  crearNota(): Promise<any> {
    let data = { tipoDoc: '01', numero: this.clave, fechaEmision: this.fechaEmision, codigo: '01', razon: "Anula Documento de Referencia" }
    return new Promise((resolve, reject) => {
      this._servicioDecodificador.decodificarXML(this.xml).subscribe(
        result1 => {
          this.fecha = this.datepipe.transform(new Date(), 'yyyy-MM-ddThh:mm:ssZZZZZ');
          console.log(this.fecha);
          this._servicioEscritorXML.crearNotaAnular(result1.xmlDecoded, "ND", data, this.claveNueva , this.fecha?this.fecha:"").subscribe(
            result2 => {
              
              this._servicioDecodificador.codificarXML(result2.xmlFile).subscribe(
                res => { console.log(res); resolve(res); },
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
          let firma = new FirmadoXML("signXML", "signFE", certificado.archivo, this.xml, certificado.pin, "ND")
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
      let envio = new EnvioXML("send", "json", token ? token : "", this.claveNueva, this.fecha?this.fecha:"",
        this.tipoIdentEmisor, this.cedulaEmisor, this.tipoIdentReceptor,
        this.cedulaReceptor, this.xml, "api-stag");
      console.log(envio);
      this._servicioEnvio.enviarFEXML(envio).subscribe(
        res => { resolve(res); },
        err => { reject(err); }
      )
    });

  }

  ngOnInit() {

  }


}
