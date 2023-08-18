import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PDFImageElement } from 'projects/ngx-pdf-editor/src/lib/components/image-element/image-element.component';
import {
  EditorConfig,
  EditorTool,
} from 'projects/ngx-pdf-editor/src/lib/models/Editor';
import {
  NgxPdfEditorComponent,
  NgxPdfEditorService,
  PDFFormTextfieldElement,
  PDFSignatureElement,
  PDFTextElement,
  SignatureElementProps,
  Signer,
} from 'projects/ngx-pdf-editor/src/public-api';

const SIGNERS: Signer[] = [
  {
    name: 'Giuseppe Ettorre',
    order: 1,
    type: 1,
  },
  {
    name: 'Mario Rossi',
    order: 2,
    type: 1,
  },
  {
    name: 'Banca XYZ',
    order: 0,
    type: 0,
  },
];
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'pdf-showreel';

  constructor(
    private matDialog: MatDialog,
    private pdfEditorService: NgxPdfEditorService
  ) {
    this.pdfEditorService.addTool(
      new EditorTool(
        'text',
        'Testo',
        'text_fields',
        (event) =>
          this.pdfEditorService.addElement<PDFTextElement>(
            PDFTextElement,
            event,
            undefined,
            undefined,
            true
          ),
        PDFTextElement
      )
    );

    this.pdfEditorService.addTool(
      new EditorTool(
        'image',
        'Immagine',
        'image',
        (event) =>
          this.pdfEditorService.addElement<PDFImageElement>(
            PDFImageElement,
            event,
            undefined,
            undefined,
            true
          ),
        PDFImageElement
      )
    );

    this.pdfEditorService.addTool(
      new EditorTool(
        'signature',
        'Firma',
        'format_shapes',
        (event) =>
          this.pdfEditorService.addElement<
            PDFSignatureElement,
            SignatureElementProps
          >(PDFSignatureElement, event, undefined, { signers: SIGNERS }),
        PDFSignatureElement
      )
    );

    this.pdfEditorService.addTool(
      new EditorTool(
        'textfield',
        'Campo testo',
        'power_input',
        (event) =>
          this.pdfEditorService.addElement<PDFFormTextfieldElement>(
            PDFFormTextfieldElement,
            event,
            undefined,
            undefined,
            true
          ),
        PDFFormTextfieldElement
      )
    );
  }

  openEditor(event?: Event) {
    const config: MatDialogConfig = new MatDialogConfig();
    config.minWidth = '90%';
    config.minHeight = '90%';
    config.maxWidth = '100%';
    config.height = '95%';
    config.width = '95%';
    // config.disableClose = true;

    const targetIfExsist = event?.target
      ? (event.target as HTMLInputElement)
      : null;
    const fileIfExsist =
      targetIfExsist && targetIfExsist.files ? targetIfExsist.files[0] : null;

    const editorConfig: EditorConfig = {
      title: 'Editor PDF',
      file: fileIfExsist ? fileIfExsist : undefined,
      language: 'es-ES',
    };

    config.data = editorConfig;

    this.matDialog.open(NgxPdfEditorComponent, config);
    targetIfExsist ? (targetIfExsist.value = '') : null;
  }
}
