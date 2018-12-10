import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DishPickerComponent } from './dish-picker.component';

describe('DishPickerComponent', () => {
  let component: DishPickerComponent;
  let fixture: ComponentFixture<DishPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DishPickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DishPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
