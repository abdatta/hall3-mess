import { Component, OnInit } from '@angular/core';
import { TokensService } from '@app/services';
import { TokenModel } from '@app/models';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  tokens: TokenModel[];
  rollno = 180161;
  loginactivity = [
    {
      detail: { rollno: 180537, name: 'Arjun'},
      time: '1 min ago',
      order: '',
    },
    {
      detail: { rollno: 170161, name: 'Ashish'},
      time: '1 min ago',
      order: '',
    },
    {
      detail: { rollno: 180360, name: 'Tarun Book'},
      time: '2 min ago',
      order: '',
    },
    {
      detail: { rollno: 180198, name: 'Jolly Llb'},
      time: '2 min ago',
      order: 'New dish Chicken Soup will be available every Wednesday in Dinner. It is Prebookable.',
    },
    {
      detail: { rollno: 180456, name: 'Praveen'},
      time: '2 min ago',
      order: 'Pay your mess bill at this link: ',
    },
    {
      detail: { rollno: 180432, name: 'Rajan'},
      time: '3 min ago',
      order: 'New dish Fish Curry will be available every Saturday in Dinner. It is Prebookable.',
    },
    {
      detail: { rollno: 180345, name: 'Rahul'},
      time: '3 min ago',
      order: 'Kindly give your valuable feedback using the feedback form link: ',
    }
  ];

  constructor(private tokenService: TokensService) { }

  ngOnInit() {
    this.tokenService.getLatestTokens()
            .subscribe(tokens => this.tokens = tokens);
  }

}
