import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MakebillsComponent } from './makebills.component';

describe('MakebillsComponent', () => {
  let component: MakebillsComponent;
  let fixture: ComponentFixture<MakebillsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MakebillsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakebillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
