import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EditorConfig } from 'projects/ngx-pdf-editor/src/lib/models/Editor';
import { NgxPdfEditorComponent } from 'projects/ngx-pdf-editor/src/public-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'pdf-showreel';

  constructor(private matDialog: MatDialog) {

  }

  openEditor(event?: Event) {
    const config: MatDialogConfig = new MatDialogConfig();
    config.minWidth = "90%";
    config.minHeight = "90%";
    config.maxWidth = "100%";
    config.height = "95%";
    config.width = "95%";
    // config.disableClose = true;

    const targetIfExsist = event?.target ? event.target as HTMLInputElement : null;
    const fileIfExsist = targetIfExsist && targetIfExsist.files ? targetIfExsist.files[0] : null;

    const editorConfig: EditorConfig = {
      title: "Editor PDF",
      file: fileIfExsist ? fileIfExsist : undefined
    }

    config.data = editorConfig;

    this.matDialog.open(NgxPdfEditorComponent, config);
    targetIfExsist ? targetIfExsist.value = "" : null;
  }
}
