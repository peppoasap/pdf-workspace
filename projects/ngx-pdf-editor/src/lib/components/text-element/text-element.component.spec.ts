import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PDFTextElement } from './text-element.component';

describe('PDFTextElement', () => {
  let component: PDFTextElement;
  let fixture: ComponentFixture<PDFTextElement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PDFTextElement]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PDFTextElement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
