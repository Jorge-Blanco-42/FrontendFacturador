import { Component, OnInit } from '@angular/core';
import { SignXMLService } from './services/signxml';
import { SignXML } from './models/signxml';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [SignXMLService]
})
export class AppComponent implements OnInit {
  title = 'Facturador';

  public signXML: SignXML;
  
  constructor(private _signXMLService: SignXMLService){
     
    this.signXML = new SignXML("signXML", "signFE", 
      "b337c43a00ec8b0ed9882375d56b270f", "pendiente",
      "1994", "FE");

  }

  ngOnInit(){
    this._signXMLService.signFEXML(this.signXML).subscribe(
      result => {
        //alert("Factura electronica firmada(?");
        console.log(<any>result)
    },
      error => {
        //alert(<any>error);
        console.log(<any>error)
    }
  );
  
  }

}

