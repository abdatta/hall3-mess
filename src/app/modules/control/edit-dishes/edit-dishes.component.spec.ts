import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDishesComponent } from './edit-dishes.component';

describe('EditDishesComponent', () => {
  let component: EditDishesComponent;
  let fixture: ComponentFixture<EditDishesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditDishesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDishesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
