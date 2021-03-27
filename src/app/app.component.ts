import { Component, OnInit } from '@angular/core';
import { SignXMLService } from './services/signxml';
import { CreateXMLService } from './services/createXML';
import { SignXML } from './models/signxml';
import { CreateXML } from './models/createXML';
import { UserService } from './services/user';
import { SendXMLService } from './services/sendXML';
import { User } from './models/user';
import { CertificateService } from './services/certificate';
import { Certificate } from './models/certificate';
import { Token } from './models/token';
import { SendXML } from './models/sendXML';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [SignXMLService, CreateXMLService, UserService, CertificateService, SendXMLService]
})
export class AppComponent implements OnInit {
  title = 'Facturador';

  public signXML: SignXML;
  public createXML: CreateXML;
  public user: User;
  public certificate: Certificate;
  public token: Token;
  public refresh_token: string;
  public sendXML: SendXML; 

  constructor(private _signXMLService: SignXMLService, private _createXMLService: CreateXMLService,
    private _userService: UserService, private _certificateService: CertificateService, private _sendXMLService: SendXMLService) {

    this.signXML = new SignXML("signXML", "signFE",
      "b337c43a00ec8b0ed9882375d56b270f", "pendiente",
      "1994", "FE");

    var linea = { "1": { "cantidad": "1", "unidadMedida": "Sp", "detalle": "Impresora", "precioUnitario": "10000", "montoTotal": "10000", "subtotal": "9900", "montoTotalLinea": "9900", "montoDescuento": "100", "naturalezaDescuento": "Pronto pago" }, "2": { "cantidad": "1", "unidadMedida": "Unid", "detalle": "producto", "precioUnitario": "10000", "montoTotal": "10000", "subtotal": "10000", "montoTotalLinea": "11170", "impuesto": { "1": { "codigo": "01", "tarifa": "11.7", "monto": "1170" } } } }

    var lineaStr = JSON.stringify(linea)
    this.createXML = new CreateXML("genXML", "gen_xml_fe", "50617061800070232071700100001011522773451107756391",
      "00100001011522773451", "2018-06-17T12:00:00-06:00", "Walner Borbon", "01", "702320717", "Walner Borbon",
      "6", "02", "03", "01", "En la jungla", "506", "64206205", "506", "00000000", "walner1borbon@gmail.com", "Walner Borbon",
      "01", "702320717", "6", "02", "03", "01", "506", "84922891", "506", "00000000", "walner.borbon@hotmail.com",
      "01", "0", "01", "CRC", "569.48", "0", "10000", "10000", "0", "10000", "10000", "20000", "100", "19900", "1170", "21070",
      "Jiji", "Bichota", lineaStr, 'False')

    this.user = new User("users", "users_log_me_in", "jorgeBlanco", "426819357");
    this.certificate = new Certificate("", "", "", "", "");
    this.refresh_token = "";
    this.token = new Token("","","","","","","","");
    this.sendXML = new SendXML("send", "json", this.token.access_token, "50626032100011751016900100001011522773402174658321", "2021-03-26T14:30:00-06:00", "01", "117510169", "01", "114480790", "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCiAgICA8RmFjdHVyYUVsZWN0cm9uaWNhIHhtbG5zPSJodHRwczovL3RyaWJ1bmV0LmhhY2llbmRhLmdvLmNyL2RvY3MvZXNxdWVtYXMvMjAxNy92NC4yL2ZhY3R1cmFFbGVjdHJvbmljYSIgeG1sbnM6ZHM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvMDkveG1sZHNpZyMiIHhtbG5zOnhzZD0iaHR0cDovL3d3dy53My5vcmcvMjAwMS9YTUxTY2hlbWEiIHhtbG5zOnhzaT0iaHR0cDovL3d3dy53My5vcmcvMjAwMS9YTUxTY2hlbWEtaW5zdGFuY2UiIHhzaTpzY2hlbWFMb2NhdGlvbj0iaHR0cHM6Ly90cmlidW5ldC5oYWNpZW5kYS5nby5jci9kb2NzL2VzcXVlbWFzLzIwMTcvdjQuMi9mYWN0dXJhRWxlY3Ryb25pY2EgRmFjdHVyYUVsZWN0cm9uaWNhX1YuNC4yLnhzZCI+DQogICAgICAgIDxDbGF2ZT41MDYyNjAzMjEwMDAxMTc1MTAxNjkwMDEwMDAwMTAxMTUyMjc3MzQwMjE3NDY1ODMyMTwvQ2xhdmU+DQogICAgICAgIDxOdW1lcm9Db25zZWN1dGl2bz4wMDEwMDAwMTAxMTUyMjc3MzQwMjwvTnVtZXJvQ29uc2VjdXRpdm8+DQogICAgICAgIDxGZWNoYUVtaXNpb24+MjAyMS0wMy0yNlQxNCA6IDMwIDogMDAtMDYgOiAwMDwvRmVjaGFFbWlzaW9uPg0KICAgICAgICA8RW1pc29yPg0KICAgICAgICAgICAgPE5vbWJyZT5Kb3JnZSBCbGFuY288L05vbWJyZT4NCiAgICAgICAgICAgIDxJZGVudGlmaWNhY2lvbj4NCiAgICAgICAgICAgICAgICA8VGlwbz4wMTwvVGlwbz4NCiAgICAgICAgICAgICAgICA8TnVtZXJvPjExNzUxMDE2OTwvTnVtZXJvPg0KICAgICAgICAgICAgPC9JZGVudGlmaWNhY2lvbj4NCiAgICAgICAgICAgIDxOb21icmVDb21lcmNpYWw+Sm9yZ2UgQmxhbmNvPC9Ob21icmVDb21lcmNpYWw+DQogICAgICAgICAgICA8VWJpY2FjaW9uPg0KICAgICAgICAgICAgICAgIDxQcm92aW5jaWE+NjwvUHJvdmluY2lhPg0KICAgICAgICAgICAgICAgIDxDYW50b24+MDI8L0NhbnRvbj4NCiAgICAgICAgICAgICAgICA8RGlzdHJpdG8+MDM8L0Rpc3RyaXRvPg0KICAgICAgICAgICAgICAgIDxCYXJyaW8+MDE8L0JhcnJpbz4NCiAgICAgICAgICAgICAgICA8T3RyYXNTZW5hcz5raWtpa2k8L090cmFzU2VuYXM+DQogICAgICAgICAgICA8L1ViaWNhY2lvbj4NCiAgICAgICAgICAgIDxUZWxlZm9ubz4NCiAgICAgICAgICAgICAgICA8Q29kaWdvUGFpcz41MDY8L0NvZGlnb1BhaXM+DQogICAgICAgICAgICAgICAgPE51bVRlbGVmb25vPjg2MTUzMzEzPC9OdW1UZWxlZm9ubz4NCiAgICAgICAgICAgIDwvVGVsZWZvbm8+DQogICAgICAgICAgICA8RmF4Pg0KICAgICAgICAgICAgICAgIDxDb2RpZ29QYWlzPjUwNjwvQ29kaWdvUGFpcz4NCiAgICAgICAgICAgICAgICA8TnVtVGVsZWZvbm8+MDAwMDAwMDA8L051bVRlbGVmb25vPg0KICAgICAgICAgICAgPC9GYXg+PENvcnJlb0VsZWN0cm9uaWNvPmpvcmdlLmx1aXMxOTk5QGhvdG1haWwuY29tPC9Db3JyZW9FbGVjdHJvbmljbz4NCiAgICAgICAgPC9FbWlzb3I+PFJlY2VwdG9yPg0KICAgICAgICAgICAgPE5vbWJyZT5KdWxpYW4gU3ViaXJvczwvTm9tYnJlPjxJZGVudGlmaWNhY2lvbj4NCiAgICAgICAgICAgICAgICA8VGlwbz4wMTwvVGlwbz4NCiAgICAgICAgICAgICAgICA8TnVtZXJvPjExNDQ4MDc5MDwvTnVtZXJvPg0KICAgICAgICAgICAgPC9JZGVudGlmaWNhY2lvbj48VGVsZWZvbm8+DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Q29kaWdvUGFpcz41MDY8L0NvZGlnb1BhaXM+DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TnVtVGVsZWZvbm8+ODQ5MjI4OTE8L051bVRlbGVmb25vPg0KICAgICAgICAgICAgICAgICAgICA8L1RlbGVmb25vPjxGYXg+DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Q29kaWdvUGFpcz41MDY8L0NvZGlnb1BhaXM+DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxOdW1UZWxlZm9ubz4wMDAwMDAwMDwvTnVtVGVsZWZvbm8+DQogICAgICAgICAgICAgICAgICAgIDwvRmF4Pg0KICAgICAgICAgICAgPENvcnJlb0VsZWN0cm9uaWNvPmp1bGlzdWJpcm9zQGhvdG1haWwuY29tPC9Db3JyZW9FbGVjdHJvbmljbz4NCiAgICAgICAgPC9SZWNlcHRvcj4NCiAgICAgICAgPENvbmRpY2lvblZlbnRhPjAxPC9Db25kaWNpb25WZW50YT4NCiAgICAgICAgPFBsYXpvQ3JlZGl0bz4wPC9QbGF6b0NyZWRpdG8+DQogICAgICAgIDxNZWRpb1BhZ28+MDE8L01lZGlvUGFnbz4NCiAgICAgICAgPERldGFsbGVTZXJ2aWNpbz4NCiAgICAgICAgPC9EZXRhbGxlU2VydmljaW8+DQogICAgICAgIDxSZXN1bWVuRmFjdHVyYT4NCiAgICAgICAgPENvZGlnb01vbmVkYT5DUkM8L0NvZGlnb01vbmVkYT4NCiAgICAgICAgPFRpcG9DYW1iaW8+NTY0LjQ4PC9UaXBvQ2FtYmlvPg0KICAgICAgICA8VG90YWxTZXJ2R3JhdmFkb3M+MDwvVG90YWxTZXJ2R3JhdmFkb3M+DQogICAgICAgIDxUb3RhbFNlcnZFeGVudG9zPjIwMDAwMDwvVG90YWxTZXJ2RXhlbnRvcz4NCiAgICAgICAgPFRvdGFsTWVyY2FuY2lhc0dyYXZhZGFzPjA8L1RvdGFsTWVyY2FuY2lhc0dyYXZhZGFzPg0KICAgICAgICA8VG90YWxNZXJjYW5jaWFzRXhlbnRhcz4wPC9Ub3RhbE1lcmNhbmNpYXNFeGVudGFzPg0KICAgICAgICA8VG90YWxHcmF2YWRvPjA8L1RvdGFsR3JhdmFkbz4NCiAgICAgICAgPFRvdGFsRXhlbnRvPjIwMDAwMDwvVG90YWxFeGVudG8+DQogICAgICAgIDxUb3RhbFZlbnRhPjIwMDAwMDwvVG90YWxWZW50YT4NCiAgICAgICAgPFRvdGFsRGVzY3VlbnRvcz4wPC9Ub3RhbERlc2N1ZW50b3M+DQogICAgICAgIDxUb3RhbFZlbnRhTmV0YT4yMDAwMDA8L1RvdGFsVmVudGFOZXRhPg0KICAgICAgICA8VG90YWxJbXB1ZXN0bz4wPC9Ub3RhbEltcHVlc3RvPg0KICAgICAgICA8VG90YWxDb21wcm9iYW50ZT4yMDAwMDA8L1RvdGFsQ29tcHJvYmFudGU+DQogICAgICAgIDwvUmVzdW1lbkZhY3R1cmE+DQogICAgICAgIDxOb3JtYXRpdmE+DQogICAgICAgIDxOdW1lcm9SZXNvbHVjaW9uPkRHVC1SLTQ4LTIwMTY8L051bWVyb1Jlc29sdWNpb24+DQogICAgICAgIDxGZWNoYVJlc29sdWNpb24+MDctMTAtMjAxNiAwODowMDowMDwvRmVjaGFSZXNvbHVjaW9uPg0KICAgICAgICA8L05vcm1hdGl2YT4NCiAgICA8ZHM6U2lnbmF0dXJlIHhtbG5zOmRzPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwLzA5L3htbGRzaWcjIiBJZD0iU2lnbmF0dXJlLWRkYjU0M2M3LWVhMGMtNGIwMC05NWI5LWQ0YmZhMmI0ZTQxMSI+PGRzOlNpZ25lZEluZm8+PGRzOkNhbm9uaWNhbGl6YXRpb25NZXRob2QgQWxnb3JpdGhtPSJodHRwOi8vd3d3LnczLm9yZy9UUi8yMDAxL1JFQy14bWwtYzE0bi0yMDAxMDMxNSIgLz48ZHM6U2lnbmF0dXJlTWV0aG9kIEFsZ29yaXRobT0iaHR0cDovL3d3dy53My5vcmcvMjAwMS8wNC94bWxkc2lnLW1vcmUjcnNhLXNoYTI1NiIgLz48ZHM6UmVmZXJlbmNlIElkPSJSZWZlcmVuY2UtMGU3OWI3MTktNjM1Yy00NzZmLWE1OWUtOGFjM2JhMTQzNjVkIiBVUkk9IiI+PGRzOlRyYW5zZm9ybXM+PGRzOlRyYW5zZm9ybSBBbGdvcml0aG09Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvMDkveG1sZHNpZyNlbnZlbG9wZWQtc2lnbmF0dXJlIiAvPjwvZHM6VHJhbnNmb3Jtcz48ZHM6RGlnZXN0TWV0aG9kIEFsZ29yaXRobT0iaHR0cDovL3d3dy53My5vcmcvMjAwMS8wNC94bWxlbmMjc2hhMjU2IiAvPjxkczpEaWdlc3RWYWx1ZT5tVTY1eWRkYjdwMk90NkpSVkhRcWFoVGlxRURwekVhRmFNRVc3RVEzSnE4PTwvZHM6RGlnZXN0VmFsdWU+PC9kczpSZWZlcmVuY2U+PGRzOlJlZmVyZW5jZSBJZD0iUmVmZXJlbmNlS2V5SW5mbyIgVVJJPSIjS2V5SW5mb0lkLVNpZ25hdHVyZS1kZGI1NDNjNy1lYTBjLTRiMDAtOTViOS1kNGJmYTJiNGU0MTEiPjxkczpEaWdlc3RNZXRob2QgQWxnb3JpdGhtPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGVuYyNzaGEyNTYiIC8+PGRzOkRpZ2VzdFZhbHVlPkdMMjFZTDZQYWhpUjgxVkgzSXJuUUtTSzhvU0h2NjZXdzFFakt6RTNRMXM9PC9kczpEaWdlc3RWYWx1ZT48L2RzOlJlZmVyZW5jZT48ZHM6UmVmZXJlbmNlIFR5cGU9Imh0dHA6Ly91cmkuZXRzaS5vcmcvMDE5MDMjU2lnbmVkUHJvcGVydGllcyIgVVJJPSIjU2lnbmVkUHJvcGVydGllcy1TaWduYXR1cmUtZGRiNTQzYzctZWEwYy00YjAwLTk1YjktZDRiZmEyYjRlNDExIj48ZHM6RGlnZXN0TWV0aG9kIEFsZ29yaXRobT0iaHR0cDovL3d3dy53My5vcmcvMjAwMS8wNC94bWxlbmMjc2hhMjU2IiAvPjxkczpEaWdlc3RWYWx1ZT5TZ0c5UmdnU3lWSWZMYnJaODNKMjdiY3h3QzVJSmtrdGM3TDZaUmk1bW9VPTwvZHM6RGlnZXN0VmFsdWU+PC9kczpSZWZlcmVuY2U+PC9kczpTaWduZWRJbmZvPjxkczpTaWduYXR1cmVWYWx1ZSBJZD0iU2lnbmF0dXJlVmFsdWUtZGRiNTQzYzctZWEwYy00YjAwLTk1YjktZDRiZmEyYjRlNDExIj5hNXdueG5ZZUQwdW5hVTNZZXZnbTJicFpYVXJzNjRRdFY0SGJUaHhWSTAySmU5cnlzZEp0a0VuY21kQUZhdHdyQ3JJVEEyZDMzTnZteFNMWGh6ZXF4Q3kycllDOGtjaXhLZ1BhZHpDMkFjQWEvQ3VSUjRnZzU5T3k0YWh2eGUvWmh4K1ExdUZTUndqbkNvYjNZZERLbWJnVzJTRFpteVA2eXZlenc1UUttM3NnV01HLzVzNFZKdzZlL3NwNFBtR1BmVVlUZzhNWm5FUWkrU1grRDAyVWRYTzVsMWRqS1c4VGY2b2kyT2VNUDJOMk1JY0ZSbnBBajdDZkhLdjF0b1RoV2d5MmNFOFVHSXp3eTJjSUtNTkQ5NTRmRVBxeEVOZVR3NUwxSEtDZVRZenR1ZUowWnlHbDIzNmVheHNIOTZEd1Baa2JwNWVGS1o4U3FTOFB0eGlrQ3c9PTwvZHM6U2lnbmF0dXJlVmFsdWU+PGRzOktleUluZm8gSWQ9IktleUluZm9JZC1TaWduYXR1cmUtZGRiNTQzYzctZWEwYy00YjAwLTk1YjktZDRiZmEyYjRlNDExIj48ZHM6WDUwOURhdGE+PGRzOlg1MDlDZXJ0aWZpY2F0ZT5NSUlGUGpDQ0F5YWdBd0lCQWdJR0FYZzRHeDQxTUEwR0NTcUdTSWIzRFFFQkN3VUFNRzR4Q3pBSkJnTlZCQVlUQWtOU01Ta3dKd1lEVlFRS0RDQk5TVTVKVTFSRlVrbFBJRVJGSUVoQlEwbEZUa1JCSUMwZ1UwRk9SRUpQV0RFTU1Bb0dBMVVFQ3d3RFJFZFVNU1l3SkFZRFZRUUREQjFEUVNCUVJWSlRUMDVCSUVwVlVrbEVTVU5CSUMwZ1UwRk9SRUpQV0RBZUZ3MHlNVEF6TVRVeU1qVTJORFJhRncweU16QXpNVFV5TWpVMk5EUmFNSUdFTVJrd0Z3WURWUVFGRXhCRFVFb3RNeTB4TURFdE5qa3lOalkxTVFzd0NRWURWUVFHRXdKRFVqRVpNQmNHQTFVRUNnd1FVRVZTVTA5T1FTQktWVkpKUkVsRFFURU1NQW9HQTFVRUN3d0RRMUJLTVRFd0x3WURWUVFERENoRFJVbENRU0JUVDBaVVYwRlNSU0JCVGtRZ1FWSlVVeUJUVDBOSlJVUkJSQ0JCVGs5T1NVMUJNSUlCSWpBTkJna3Foa2lHOXcwQkFRRUZBQU9DQVE4QU1JSUJDZ0tDQVFFQWxORHdkZ0IraFFTa2x4WkVwb2czeVlCRUhwZDhWV1FpZWxibHBieWtuM0V0anduTU4zSWVZc1hNNXpBeGpnMTFSNFdMRmZHQzVzaDBlcGFta2E3VDJVNjlTNkhpcWUvbTRuVXljQnBoczlIc2ZMUEIxRE8zT0ZMR2E5RFZQYytYTnYxNG10ZU1WOHVnMzR4ZE9kOGMxQVU1QWZhSGNneG1GVENWVFQ2blRQUmVqU2dLVFcvSmtTRTgyVXdNOXJGVVpOUkNWVVd3c3FhaW1CVnlqdS9iQmRXQ0NVbTBpcjNXT1dqdHNPUVBHd29mNmFlUmo5WEtnYVhsWEFRdGd5Yi92cjBYcFFaWjlKb2F0YVNQY2RySlgrUmhIVGhKaFhHZXdxRjRwVk1HM2x5WVF5NHZTM1lLcjRUQTdjUnl1dUJkWGVMTVNQQXJ3a2VLVG4weUd1T0Ywd0lEQVFBQm80SEtNSUhITUI4R0ExVWRJd1FZTUJhQUZLd29SZmd2blVoZkxCOEFrT3N5eGFNSFU0RGhNQjBHQTFVZERnUVdCQlRONDg4UHZVemlwTzlRY0NQWHZwSksvdzg5QXpBTEJnTlZIUThFQkFNQ0JzQXdFd1lEVlIwbEJBd3dDZ1lJS3dZQkJRVUhBd1F3WXdZSUt3WUJCUVVIQVFFRVZ6QlZNRk1HQ0NzR0FRVUZCekFDaGtkb2RIUndjem92TDNCcmFTNWpiMjF3Y205aVlXNTBaWE5sYkdWamRISnZibWxqYjNNdVoyOHVZM0l2YzNSaFp5OXBiblJsY20xbFpHbGhkR1V0Y0dvdGNHVnRMbU55ZERBTkJna3Foa2lHOXcwQkFRc0ZBQU9DQWdFQWthUGtSa0tkc3pZQXppUDJ2TytEVFRkZkxCZ2RmRXQyZCtuQUNsNmhDTzZYS1p5YzEycWYyVkZDMk1wdGFZekhGQWRyVDFsREZSZS9SWmZ6SUJSWkxzOGhZNkVjZEdpOGZzZWZnOFlXWE5GUFl0eDdidk03T3Z2UXh0NEd2TjZSVDY2YldWMFA1OG4ydkd1TFZQekNVNUJsK29mU1U3Q1A0Qi9BZjdpRUxDK20xbUJHNnptNmtkbzNRUWJHMklrVW1OU2I1VFIySnFxYmhzMUNwMVdoSWhaZFd2MTBmVlVQZGx5Y2tGQkUySC9UeDNXdE9OMGpDSmFpZUJrNmR6QlFtTHFUUUdOdk9lbGtURFJJNkkzQllVbDJyUjNCOGFZSmZJdkkxL2NJeCtZTU5wZkNTQ2FBQlNzL3lPV0xkZytxMWt5enhLUmQzZHdBczFmZlhlZmFNQ3FtQnloT3pIeXNXa0k2MVk5YUFaU2g2UFN0Vi8zTU9WZFlrbHVmOE4yYkF4L2wzeE9GTkNac2p2WlFYaTFHQzlpcFlTRTFnRGZacWx3Qjk5YjIzWEZtQUp3NlRyZ3RDVnZBblBzSGRUSm11NGFrZ1RZZTYxUG9JWStCbGtqb2ZmQ3ZSaXNsaWU3cWUrc2U0bzdKOWdLNGJCdkhlOXo4OUN3TTNGamw5Sk8ybUpNaEJhSWwvbWllNllOeE9KbFBFelBkTXZ3a3dhNGNBY0xLSzdITE14anRUU0x5OW9lYmRMNjJEMTdla3ZrallmUjRPT3RTc0twbVdSaWVNNWU4RSszNnhHcmpPS0VoTWJYVitDN0Z0YytzM1pFN0ZzdndkNGNaV2VaalZvNCtCTHBTZTdjSEE3VXNGZ2s4VlNzNmFVcTdUVlEyZHNwTi9DRVMrd051S0Z3PTwvZHM6WDUwOUNlcnRpZmljYXRlPjwvZHM6WDUwOURhdGE+PGRzOktleVZhbHVlPjxkczpSU0FLZXlWYWx1ZT48ZHM6TW9kdWx1cz5sTkR3ZGdCK2hRU2tseFpFcG9nM3lZQkVIcGQ4VldRaWVsYmxwYnlrbjNFdGp3bk1OM0llWXNYTTV6QXhqZzExUjRXTEZmR0M1c2gwZXBhbWthN1QyVTY5UzZIaXFlL200blV5Y0JwaHM5SHNmTFBCMURPM09GTEdhOURWUGMrWE52MTRtdGVNVjh1ZzM0eGRPZDhjMUFVNUFmYUhjZ3htRlRDVlRUNm5UUFJlalNnS1RXL0prU0U4MlV3TTlyRlVaTlJDVlVXd3NxYWltQlZ5anUvYkJkV0NDVW0waXIzV09XanRzT1FQR3dvZjZhZVJqOVhLZ2FYbFhBUXRneWIvdnIwWHBRWlo5Sm9hdGFTUGNkckpYK1JoSFRoSmhYR2V3cUY0cFZNRzNseVlReTR2UzNZS3I0VEE3Y1J5dXVCZFhlTE1TUEFyd2tlS1RuMHlHdU9GMHc9PTwvZHM6TW9kdWx1cz48ZHM6RXhwb25lbnQ+QVFBQjwvZHM6RXhwb25lbnQ+PC9kczpSU0FLZXlWYWx1ZT48L2RzOktleVZhbHVlPjwvZHM6S2V5SW5mbz48ZHM6T2JqZWN0IElkPSJYYWRlc09iamVjdElkLTQzMjA4ZDEwLTY1MGMtNGY0Mi1hZjgwLWZjODg5OTYyYzlhYyI+PHhhZGVzOlF1YWxpZnlpbmdQcm9wZXJ0aWVzIHhtbG5zOnhhZGVzPSJodHRwOi8vdXJpLmV0c2kub3JnLzAxOTAzL3YxLjMuMiMiIElkPSJRdWFsaWZ5aW5nUHJvcGVydGllcy0wMTJiOGRmNi1iOTNlLTQ4NjctOTkwMS04MzQ0N2ZmY2U0YmYiIFRhcmdldD0iI1NpZ25hdHVyZS1kZGI1NDNjNy1lYTBjLTRiMDAtOTViOS1kNGJmYTJiNGU0MTEiPjx4YWRlczpTaWduZWRQcm9wZXJ0aWVzIElkPSJTaWduZWRQcm9wZXJ0aWVzLVNpZ25hdHVyZS1kZGI1NDNjNy1lYTBjLTRiMDAtOTViOS1kNGJmYTJiNGU0MTEiPjx4YWRlczpTaWduZWRTaWduYXR1cmVQcm9wZXJ0aWVzPjx4YWRlczpTaWduaW5nVGltZT4yMDIxLTAzLTI2VDE1OjExOjU1LTA2OjAwPC94YWRlczpTaWduaW5nVGltZT48eGFkZXM6U2lnbmluZ0NlcnRpZmljYXRlPjx4YWRlczpDZXJ0Pjx4YWRlczpDZXJ0RGlnZXN0PjxkczpEaWdlc3RNZXRob2QgQWxnb3JpdGhtPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGVuYyNzaGEyNTYiIC8+PGRzOkRpZ2VzdFZhbHVlPmo2R1oxY2RHRDE3SFU4UGhuYjhiZFJ3NXV3WmExU3lHRkQ5SC9uaU9WZEk9PC9kczpEaWdlc3RWYWx1ZT48L3hhZGVzOkNlcnREaWdlc3Q+PHhhZGVzOklzc3VlclNlcmlhbD48ZHM6WDUwOUlzc3Vlck5hbWU+Q049Q0EgUEVSU09OQSBKVVJJRElDQSAtIFNBTkRCT1gsIE9VPURHVCwgTz1NSU5JU1RFUklPIERFIEhBQ0lFTkRBIC0gU0FOREJPWCwgQz1DUjwvZHM6WDUwOUlzc3Vlck5hbWU+PGRzOlg1MDlTZXJpYWxOdW1iZXI+MTYxNTg0OTAwNDU5NzwvZHM6WDUwOVNlcmlhbE51bWJlcj48L3hhZGVzOklzc3VlclNlcmlhbD48L3hhZGVzOkNlcnQ+PC94YWRlczpTaWduaW5nQ2VydGlmaWNhdGU+PHhhZGVzOlNpZ25hdHVyZVBvbGljeUlkZW50aWZpZXI+PHhhZGVzOlNpZ25hdHVyZVBvbGljeUlkPjx4YWRlczpTaWdQb2xpY3lJZD48eGFkZXM6SWRlbnRpZmllcj5odHRwczovL3RyaWJ1bmV0LmhhY2llbmRhLmdvLmNyL2RvY3MvZXNxdWVtYXMvMjAxNi92NC9SZXNvbHVjaW9uJTIwQ29tcHJvYmFudGVzJTIwRWxlY3Ryb25pY29zJTIwJTIwREdULVItNDgtMjAxNi5wZGY8L3hhZGVzOklkZW50aWZpZXI+PHhhZGVzOkRlc2NyaXB0aW9uIC8+PC94YWRlczpTaWdQb2xpY3lJZD48eGFkZXM6U2lnUG9saWN5SGFzaD48ZHM6RGlnZXN0TWV0aG9kIEFsZ29yaXRobT0iaHR0cDovL3d3dy53My5vcmcvMjAwMC8wOS94bWxkc2lnI3NoYTEiIC8+PGRzOkRpZ2VzdFZhbHVlPlY4bFZWTkdEQ1BlbjZWRUxSRDFKYThIQVJGaz08L2RzOkRpZ2VzdFZhbHVlPjwveGFkZXM6U2lnUG9saWN5SGFzaD48L3hhZGVzOlNpZ25hdHVyZVBvbGljeUlkPjwveGFkZXM6U2lnbmF0dXJlUG9saWN5SWRlbnRpZmllcj48L3hhZGVzOlNpZ25lZFNpZ25hdHVyZVByb3BlcnRpZXM+PHhhZGVzOlNpZ25lZERhdGFPYmplY3RQcm9wZXJ0aWVzPjx4YWRlczpEYXRhT2JqZWN0Rm9ybWF0IE9iamVjdFJlZmVyZW5jZT0iI1JlZmVyZW5jZS0wZTc5YjcxOS02MzVjLTQ3NmYtYTU5ZS04YWMzYmExNDM2NWQiPjx4YWRlczpNaW1lVHlwZT50ZXh0L3htbDwveGFkZXM6TWltZVR5cGU+PHhhZGVzOkVuY29kaW5nPlVURi04PC94YWRlczpFbmNvZGluZz48L3hhZGVzOkRhdGFPYmplY3RGb3JtYXQ+PC94YWRlczpTaWduZWREYXRhT2JqZWN0UHJvcGVydGllcz48L3hhZGVzOlNpZ25lZFByb3BlcnRpZXM+PC94YWRlczpRdWFsaWZ5aW5nUHJvcGVydGllcz48L2RzOk9iamVjdD48L2RzOlNpZ25hdHVyZT48L0ZhY3R1cmFFbGVjdHJvbmljYT4=",
    "api-stag");
  }


  ngOnInit() {
    localStorage.removeItem("roken");
    localStorage.removeItem("refresh");
    this._certificateService.getCertificate("4").subscribe(
      result => {
        console.log("This is the certificate: ", <any>result)
        this.certificate = result;
        console. log(this.certificate);
        this.getToken(this.certificate);
      },
      error => {
        //alert(<any>error);
        console.log(<any>error)
      }
    );
  }

  getToken(certificate: Certificate) {
    this._certificateService.getToken(certificate).subscribe(
      result => {
        console.log("This is the token: ", result);
        this.token = result.resp;
        localStorage.setItem("token", this.token.refresh_token);
        localStorage.setItem("refresh", this.token.access_token);
        this.sendXML.token = this.token.access_token;
        this._sendXMLService.sendFEXML(this.sendXML).subscribe(
          result => {
            console.log("This is the answer: ",<any>result)
          },
          error =>{
            console.log(<any>error)
          }
        );
        setInterval(()=>{
          let refresh = localStorage.getItem("refresh");
          if(refresh){
            this.refreshToken(refresh);
          }
          
     }, 290000);
      },
      error => {
        console.log(<any>error)
      }
    );
  }

  refreshToken(refresh: string){
    console.log("refreshing with",refresh);
    this._certificateService.refreshToken(refresh).subscribe(
      result => {
        console.log("This is the refresh: ", <any>result);
        this.token = result.resp;
        localStorage.setItem("token", this.token.refresh_token);
        localStorage.setItem("refresh", this.token.access_token);
      },
      error => {
        console.log(<any>error)
      }
    );
  }

}

