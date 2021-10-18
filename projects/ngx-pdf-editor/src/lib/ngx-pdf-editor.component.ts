import { DomPortalOutlet } from '@angular/cdk/portal';
import { ApplicationRef, Component, ComponentFactoryResolver, Inject, Injector, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PDFSignatureElement } from './components/signature-element/signature-element.component';
import { PDFTextElement } from './components/text-element/text-element.component';
import { Editor, EditorConfig, EditorTool, RenderedPage } from './models/Editor';
import { SignatureElementProps, Signer } from './models/Signature';
import { NgxPdfEditorService } from './ngx-pdf-editor.service';

@Component({
  selector: 'ngx-pdf-editor',
  templateUrl: './ngx-pdf-editor.component.html',
  styleUrls: ['./ngx-pdf-editor.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class NgxPdfEditorComponent implements OnInit, OnDestroy {

  pdfRenderCompleted: boolean = false;
  editor!: Editor;


  constructor(
    @Inject(MAT_DIALOG_DATA) public editorConfig: EditorConfig,
    private _componentFactoryResolver: ComponentFactoryResolver,
    private _appRef: ApplicationRef,
    private _defInjector: Injector,
    public pdfEditorService: NgxPdfEditorService,
    private dialogRef: MatDialogRef<NgxPdfEditorComponent>
  ) {
    if (editorConfig.file) {
      this.pdfEditorService.setPDF(editorConfig.file);
      this.editor = this.pdfEditorService.getEditor();
      this.editor.filename = editorConfig.file.name;
    }

    //Add Listener to tools
    // this.pdfEditorService.addTool(
    //   new EditorTool('text',
    //     'Testo',
    //     'text_fields',
    //     (event) => this.pdfEditorService.addElement<PDFTextElement>(PDFTextElement, event, undefined, undefined, true))
    // );

    // this.pdfEditorService.addTool(new EditorTool('signature', 'Firma', 'format_shapes', (event) => this.pdfEditorService.addElement<PDFSignatureElement, SignatureElementProps>(PDFSignatureElement, event, undefined, { signers: signersTest })));

  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.pdfEditorService.reset();
  }

  pageRendered(page: any) {
    let pageRendered: RenderedPage = page as RenderedPage;
    pageRendered.viewport = pageRendered.source.viewport;
    if (pageRendered.pageNumber === 1) {
      this.editor.viewportScale = pageRendered.viewport.scale;
    }
    pageRendered.portalOutlet = new DomPortalOutlet(pageRendered.source.div, this._componentFactoryResolver, this._appRef, this._defInjector, document);
    this.editor.pages.push(pageRendered);
    console.log("PAGE", pageRendered);

    pageRendered.source.div.onclick = (event) => {
      console.log("EXEC. CLICK EVENT:", event);
      this.editor.selectedTool?.callback(event);
    }
  }

  render() {
    this.pdfEditorService.render().then((renderResult) => {
      console.log("RENDERED COMPLETED");
      console.log(renderResult);
      this.dialogRef.close(renderResult)
    })
  }

  changeName(name: string): void {
    this.editor.filename = name;
  }

}
