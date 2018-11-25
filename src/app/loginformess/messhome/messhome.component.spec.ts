import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MesshomeComponent } from './messhome.component';

describe('MesshomeComponent', () => {
  let component: MesshomeComponent;
  let fixture: ComponentFixture<MesshomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MesshomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MesshomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
