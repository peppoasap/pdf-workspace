import { TestBed } from '@angular/core/testing';

import { NgxPdfEditorService } from './ngx-pdf-editor.service';

describe('NgxPdfEditorService', () => {
  let service: NgxPdfEditorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxPdfEditorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
