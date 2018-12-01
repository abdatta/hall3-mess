import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { SettingsComponent } from '@app/components/residentcomponents/settings/settings.component';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  notifs = [
    {
      head: 'New dish added - Chicken Korma',
      date: 'Today',
      details: 'New dish Chicken Korma will be available every Thursday in Dinner. It is Prebookable.',
      read: false
    },
    {
      head: 'Feedback form is open.',
      date: '1 day ago',
      details: 'Kindly give your valuable feedback using the feedback form link: ',
      read: false
    },
    {
      head: 'November Mess bill is out!',
      date: '2 days ago',
      details: 'Pay your mess bill at this link: ',
      read: false
    },
    {
      head: 'New dish added - Chicken Soup',
      date: '21 Nov \'18',
      details: 'New dish Chicken Soup will be available every Wednesday in Dinner. It is Prebookable.',
      read: true
    },
    {
      head: 'October Mess bill is out!',
      date: '29 Oct \'18',
      details: 'Pay your mess bill at this link: ',
      read: true
    },
    {
      head: 'New dish added - Fish Curry',
      date: '14 Oct \'18',
      details: 'New dish Fish Curry will be available every Saturday in Dinner. It is Prebookable.',
      read: true
    },
    {
      head: 'Feedback form is open.',
      date: '02 Oct \'18',
      details: 'Kindly give your valuable feedback using the feedback form link: ',
      read: true
    }
  ];

  constructor(public settings: MatDialog) { }

  ngOnInit() {
  }

  openSettings() {
    const dialogRef = this.settings.open(SettingsComponent, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      // save data or do something
    });
  }

  filterRead(read: boolean) {
    return this.notifs.filter(notif => notif.read === read);
  }

}
