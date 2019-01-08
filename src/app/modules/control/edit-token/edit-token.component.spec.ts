import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTokenComponent } from './edit-token.component';

describe('EditTokenComponent', () => {
  let component: EditTokenComponent;
  let fixture: ComponentFixture<EditTokenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditTokenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
