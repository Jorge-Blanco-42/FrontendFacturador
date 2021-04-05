import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-factura',
  templateUrl: './create-factura.component.html',
  styleUrls: ['./create-factura.component.css']
})
export class CreateFacturaComponent implements OnInit {

  public isCollapsedEmisorData = true;

  constructor() { }

  ngOnInit(): void {
  }

}
