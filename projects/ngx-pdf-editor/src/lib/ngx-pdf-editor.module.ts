import { NgModule } from '@angular/core';
import { NgxPdfEditorComponent } from './ngx-pdf-editor.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { OverlayModule } from '@angular/cdk/overlay';

import { CommonModule } from '@angular/common';
import { PortalModule } from '@angular/cdk/portal';
import { ReactiveFormsModule } from '@angular/forms';
import { PDFTextElement } from './components/text-element/text-element.component';
import { ToolButtonComponent } from './components/tool-button/tool-button.component';
import { PDFSignatureElement } from './components/signature-element/signature-element.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';
import { PDFImageElement } from './components/image-element/image-element.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { PDFFormTextfieldElement } from './components/form-textfield/form-textfield.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, '/assets/locales/', '.json');
}

@NgModule({
  declarations: [
    NgxPdfEditorComponent,
    PDFTextElement,
    ToolButtonComponent,
    PDFSignatureElement,
    PDFImageElement,
    PDFFormTextfieldElement,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatDialogModule,
    DragDropModule,
    OverlayModule,
    PortalModule,
    NgxExtendedPdfViewerModule,
    TranslateModule,
  ],
  exports: [NgxPdfEditorComponent],
})
export class NgxPdfEditorModule {}
