import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemslistComponent } from './itemslist.component';

describe('ItemslistComponent', () => {
  let component: ItemslistComponent;
  let fixture: ComponentFixture<ItemslistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemslistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
