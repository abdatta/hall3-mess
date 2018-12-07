import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  role = 'resident';
  nav = [
    {
      title: 'Notifications',
      url: '/home/notifications',
      icon: 'notifications',
      badge: 3
    },
    {
      title: 'Book',
      url: '/home/book',
      icon: 'border_color'
    },
    {
      title: 'Pre-book',
      url: '/home/prebook',
      icon: 'restaurant'
    },
    {
      title: 'Menu This Week',
      url: '/home/thisweek',
      icon: 'restaurant_menu'
    },
    {
      title: 'Bills and History',
      url: '/home/history',
      icon: 'calendar_today'
    },
    {
      title: 'Not Well',
      url: '/home/notwell',
      icon: 'local_hospital'
    },
    {
      title: 'Change Password',
      url: '/home/changepassword',
      icon: 'vpn_key'
    },
    {
      title: 'Book Guestroom',
      url: '/home/guestroom',
      icon: 'hotel'
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
