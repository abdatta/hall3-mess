import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessLoginComponent } from './mess-login.component';

describe('MessLoginComponent', () => {
  let component: MessLoginComponent;
  let fixture: ComponentFixture<MessLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
