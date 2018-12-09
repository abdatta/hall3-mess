import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  role = 'secy';
  nav = [
    {
      title: 'Notifications',
      url: '/control/notify',
      icon: 'notifications',
      badge: 3
    },
    {
      title: 'Notify People',
      url: '/control/notify',
      icon: 'notifications_active',
    },
    {
      title: 'Edit items',
      url: '/control/edititem',
      icon: 'settings',
    },
    {
      title: 'Make Bills',
      url: '/control/makebills',
      icon: 'account_balance_wallet',
    },
    {
      title: 'Change Password',
      url: '/control/changepassword',
      icon: 'vpn_key',
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
