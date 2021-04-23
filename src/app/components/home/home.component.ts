import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() { }

  scroll(name: string) {
    var el = <HTMLElement>document.getElementById(name);
    el.scrollIntoView();
  }
  
  ngOnInit(): void {
  }

  

}


