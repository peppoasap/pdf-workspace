import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxPdfEditorComponent } from './ngx-pdf-editor.component';

describe('NgxPdfEditorComponent', () => {
  let component: NgxPdfEditorComponent;
  let fixture: ComponentFixture<NgxPdfEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgxPdfEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxPdfEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
