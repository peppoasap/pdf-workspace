import { DragDrop, DragRef } from '@angular/cdk/drag-drop';
import {
  Component,
  ElementRef,
  HostBinding,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  PDFElement,
  PDFElementHost,
  PDFElementJSON,
} from '../../models/Editor';
import { SignatureElementProps } from '../../models/Signature';
import { NgxPdfEditorService } from '../../ngx-pdf-editor.service';

@Component({
  selector: 'signature-element',
  templateUrl: './signature-element.component.html',
  styleUrls: ['./signature-element.component.css'],
  host: {
    class: 'pdfElement signatureElement',
  },
})
export class PDFSignatureElement
  implements OnInit, OnDestroy, PDFElementHost<PDFSignatureElement>
{
  element!: PDFElement<PDFSignatureElement, SignatureElementProps>;
  @HostBinding('style.left') left = '0px';
  @HostBinding('style.top') top = '0px';

  @ViewChild('signature', { static: true })
  signature!: ElementRef<HTMLDivElement>;

  dragRef!: DragRef;
  isOverlayOpen: boolean = false;

  constructor(
    private ngxPdfEditorService: NgxPdfEditorService,
    private dragDrop: DragDrop
  ) {}

  onClick() {
    this.signature.nativeElement.focus();
    this.isOverlayOpen = true;
  }

  onBlur(event: FocusEvent) {
    console.log('ON BLUR', event);

    const target = event.relatedTarget as HTMLElement;
    if (!target || !target.classList.contains('unfocusable')) {
      // this.element.value = this.text.nativeElement.textContent || '';
      this.isOverlayOpen = false;
    } else {
      event.preventDefault();
    }
  }

  ngOnInit(): void {
    if (this.element) {
      this.left = this.element.x;
      this.top = this.element.y;
      this.initializeDrag();
      setTimeout(() => this.onClick(), 10);
      if (this.element.props) {
        this.element.value = this.element.props?.signers[0].order.toString();
      }
    }
  }

  ngOnDestroy() {
    this.dragRef ? this.dragRef.dispose() : null;
    this.isOverlayOpen = false;
  }

  private initializeDrag(): void {
    this.dragRef = this.dragDrop.createDrag(this.element.componentRef.location);
    this.dragRef.withBoundaryElement(this.element.parent);
    this.dragRef.started.subscribe(() => {
      this.isOverlayOpen = false;
    });

    this.dragRef.ended.subscribe((_dragRef: any) => {
      this.ngxPdfEditorService.updatePosition<PDFSignatureElement>(
        this.element
      );
      _dragRef.source.reset();
      this.isOverlayOpen = true;
    });
  }

  changeSigner(signerValue: string): void {
    this.element.value = signerValue;
    this.signature.nativeElement.focus();
  }

  getNameFromSignerOrder(signerOrder: string) {
    if (signerOrder) {
      return this.element.props?.signers.find(
        (signer) => signer.order === Number.parseInt(signerOrder)
      )?.name;
    } else {
      return null;
    }
  }

  export(): PDFElementJSON {
    return this.ngxPdfEditorService.export<PDFSignatureElement>(this.element);
  }

  deleteElement(): void {
    this.ngxPdfEditorService.deleteElement(this.element);
  }
}
