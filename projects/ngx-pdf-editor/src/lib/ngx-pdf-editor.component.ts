import { DomPortalOutlet } from '@angular/cdk/portal';
import {
  ApplicationRef,
  Component,
  ComponentFactoryResolver,
  Inject,
  Injector,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  NgxExtendedPdfViewerComponent,
  PageRenderedEvent,
  PagesLoadedEvent,
  pdfDefaultOptions,
} from 'ngx-extended-pdf-viewer';
import { Editor, EditorConfig, RenderedPage } from './models/Editor';
import { NgxPdfEditorService } from './ngx-pdf-editor.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ngx-pdf-editor',
  templateUrl: './ngx-pdf-editor.component.html',
  styleUrls: ['./ngx-pdf-editor.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NgxPdfEditorComponent implements OnInit, OnDestroy {
  pdfRenderCompleted: boolean = false;
  editor!: Editor;
  totalPagesNumber: number = 1;

  @ViewChild('pdfViewerHost') pdfViewerHost!: NgxExtendedPdfViewerComponent;

  constructor(
    @Inject(MAT_DIALOG_DATA) public editorConfig: EditorConfig,
    private _componentFactoryResolver: ComponentFactoryResolver,
    private _appRef: ApplicationRef,
    private _defInjector: Injector,
    public pdfEditorService: NgxPdfEditorService,
    private dialogRef: MatDialogRef<NgxPdfEditorComponent>
  ) {
    pdfDefaultOptions.doubleTapZoomFactor = '100%';

    if (editorConfig.file) {
      this.pdfEditorService.setPDF(editorConfig.file);
      this.editor = this.pdfEditorService.getEditor();
      this.editor.filename = editorConfig.file.name;
    }
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.pdfEditorService.reset();
  }

  pageRendered(page: PageRenderedEvent) {
    let pageRendered: RenderedPage = page as unknown as RenderedPage;
    pageRendered.viewport = pageRendered.source.viewport;
    if (pageRendered.pageNumber === 1) {
      this.editor.viewportScale = pageRendered.viewport.scale;
    }
    pageRendered.portalOutlet = new DomPortalOutlet(
      pageRendered.source.div,
      this._componentFactoryResolver,
      this._appRef,
      this._defInjector,
      document
    );
    this.editor.pages.push(pageRendered);

    pageRendered.source.div.onclick = (event) => {
      console.log('EXEC. CLICK EVENT:', event);
      const target = event.target as HTMLElement;
      if (target.tagName === 'CANVAS') {
        this.editor.selectedTool?.callback(event);
      } else {
        this.pdfEditorService.unselectTool();
      }
    };

    console.log('PAGE RENDERED', pageRendered);
  }

  pagesLoaded(event: PagesLoadedEvent) {
    this.totalPagesNumber = event.pagesCount;
    this.pdfRenderCompleted = true;
  }

  getTotalPagesNumberArray() {
    return Array(this.totalPagesNumber)
      .fill(0)
      .map((x, i) => i + 1);
  }

  render() {
    this.pdfEditorService.render().then((renderResult) => {
      console.log('RENDERED COMPLETED');
      console.log(renderResult);
      this.dialogRef.close(renderResult);
    });
  }

  changeName(name: string): void {
    this.editor.filename = name;
  }

  makeItAbsolute(index: number) {
    console.log('PAGE ABS:', index);
    const pdfPreview = document.getElementById(`pdf-preview-${index}`);
    if (pdfPreview) {
      pdfPreview.firstElementChild?.classList.add('relative');
    }
  }

  // addBlankPage() {
  //   this.pdfRenderCompleted = false;
  //   this.pdfEditorService.addBlankPage().then(() => console.log("BLANK PAGE ADDED."));
  // }
}
