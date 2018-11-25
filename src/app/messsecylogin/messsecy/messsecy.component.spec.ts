import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MesssecyComponent } from './messsecy.component';

describe('MesssecyComponent', () => {
  let component: MesssecyComponent;
  let fixture: ComponentFixture<MesssecyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MesssecyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MesssecyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
