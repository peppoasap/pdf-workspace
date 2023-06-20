import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTextfieldComponent } from './form-textfield.component';

describe('FormTextfieldComponent', () => {
  let component: FormTextfieldComponent;
  let fixture: ComponentFixture<FormTextfieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormTextfieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormTextfieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
