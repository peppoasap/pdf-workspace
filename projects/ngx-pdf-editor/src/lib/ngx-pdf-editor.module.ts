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



@NgModule({
  declarations: [
    NgxPdfEditorComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatButtonModule,
    MatIconModule,
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
