import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgopasswordComponent } from './forgopassword.component';

describe('ForgopasswordComponent', () => {
  let component: ForgopasswordComponent;
  let fixture: ComponentFixture<ForgopasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForgopasswordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgopasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
