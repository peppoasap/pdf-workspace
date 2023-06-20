import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PDFImageElement } from './image-element.component';

describe('PDFImageElement', () => {
  let component: PDFImageElement;
  let fixture: ComponentFixture<PDFImageElement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PDFImageElement]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PDFImageElement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
