import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/services';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-issuetoken',
  templateUrl: './issuetoken.component.html',
  styleUrls: ['./issuetoken.component.css']
})
export class IssuetokenComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

}
