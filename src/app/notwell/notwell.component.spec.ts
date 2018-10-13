import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotwellComponent } from './notwell.component';

describe('NotwellComponent', () => {
  let component: NotwellComponent;
  let fixture: ComponentFixture<NotwellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotwellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotwellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
