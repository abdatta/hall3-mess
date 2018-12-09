import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThisweekComponent } from './thisweek.component';

describe('ThisweekComponent', () => {
  let component: ThisweekComponent;
  let fixture: ComponentFixture<ThisweekComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThisweekComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThisweekComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
