import { Component, OnInit } from '@angular/core';
import { SwUpdate, SwPush } from '@angular/service-worker';
import { AuthService } from '@app/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  update = false;

  constructor(private swUpdate: SwUpdate) {}

  ngOnInit() {
    this.swUpdate.available.subscribe(event => {
      this.update = true;
    });
  }
}
