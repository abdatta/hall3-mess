import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  currentUrl: string;
  role = 'mess';
  nav = [
    {
      title: 'Notifications',
      url: '/mess/issuetoken',
      icon: 'notifications',
      badge: 3
    },
    {
      title: 'Issue Token',
      url: '/mess/issuetoken',
      icon: 'monetization_on',
    },
    {
      title: 'Non-Veg Booking',
      url: '/mess/nonvegbookings',
      icon: 'restaurant',
    },
    {
      title: 'Change Password',
      url: '/mess/changepassword',
      icon: 'vpn_key',
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
