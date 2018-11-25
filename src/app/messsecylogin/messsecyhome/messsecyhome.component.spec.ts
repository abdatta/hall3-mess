import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MesssecyhomeComponent } from './messsecyhome.component';

describe('MesssecyhomeComponent', () => {
  let component: MesssecyhomeComponent;
  let fixture: ComponentFixture<MesssecyhomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MesssecyhomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MesssecyhomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
