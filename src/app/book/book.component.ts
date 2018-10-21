import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit {

  // sample dishes for extras
  dishes = [
    {
      name: 'Paneer-Mushroom',
      selected: false,
      quantity: 1
    },
    {
      name: 'Dal-Fry',
      selected: false,
      quantity: 1
    },
    {
      name: 'Chicken Butter Masala',
      selected: false,
      quantity: 1
    },
    {
      name: 'Paneer Bujiya',
      selected: false,
      quantity: 1
    },
    {
      name: 'Egg',
      selected: false,
      quantity: 1
    }
  ];

  constructor() { }

  ngOnInit() {
  }

  changeQuantity(i: number, q: number) {
    this.dishes[i].quantity += q;
    if (this.dishes[i].quantity < 1) {
      this.dishes[i].quantity = 1;
    }
  }

  resetQuantity(i: number) {
    this.dishes[i].quantity = 1;
  }

}
