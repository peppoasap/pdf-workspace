import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PDFSignatureElement } from './signature-element.component';

describe('PDFSignatureElement', () => {
  let component: PDFSignatureElement;
  let fixture: ComponentFixture<PDFSignatureElement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PDFSignatureElement]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PDFSignatureElement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
