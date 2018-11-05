import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrebookComponent } from './prebook.component';

describe('PrebookComponent', () => {
  let component: PrebookComponent;
  let fixture: ComponentFixture<PrebookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrebookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrebookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
