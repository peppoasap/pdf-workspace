import { NgModule } from '@angular/core';
import { NgxPdfEditorComponent } from './ngx-pdf-editor.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { OverlayModule } from '@angular/cdk/overlay';

import { PdfViewerModule } from 'ng2-pdf-viewer';
import { CommonModule } from '@angular/common';
import { PortalModule } from '@angular/cdk/portal';
import { ReactiveFormsModule } from '@angular/forms';
import { PDFTextElement } from './components/text-element/text-element.component';
import { ToolButtonComponent } from './components/tool-button/tool-button.component';
import { PDFSignatureElement } from './components/signature-element/signature-element.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';



@NgModule({
  declarations: [
    NgxPdfEditorComponent,
    PDFTextElement,
    ToolButtonComponent,
    PDFSignatureElement
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatDialogModule,
    DragDropModule,
    OverlayModule,
    PortalModule,
    PdfViewerModule
  ],
  exports: [
    NgxPdfEditorComponent
  ]
})
export class NgxPdfEditorModule { }
