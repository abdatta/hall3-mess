import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-messsecyhome',
  templateUrl: './messsecyhome.component.html',
  styleUrls: ['./messsecyhome.component.css']
})
export class MesssecyhomeComponent implements OnInit {

  role = 'secy';
  nav = [
    {
      title: 'Notifications',
      url: '/messsecyhome/notify',
      icon: 'notifications',
      badge: 3
    },
    {
      title: 'Notify People',
      url: '/messsecyhome/notify',
      icon: 'notifications_active',
    },
    {
      title: 'Edit items',
      url: '/messsecyhome/edititem',
      icon: 'settings',
    },
    {
      title: 'Make Bills',
      url: '/messsecyhome/makebills',
      icon: 'account_balance_wallet',
    },
    {
      title: 'Change Password',
      url: '/messsecyhome/changepassword',
      icon: 'vpn_key',
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
