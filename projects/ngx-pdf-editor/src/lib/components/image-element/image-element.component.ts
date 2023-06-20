import { DragDrop, DragRef } from '@angular/cdk/drag-drop';
import { Component, ElementRef, HostBinding, OnInit, ViewChild } from '@angular/core';
import { PDFElement, PDFElementHost, PDFElementJSON } from '../../models/Editor';
import { NgxPdfEditorService } from '../../ngx-pdf-editor.service';

const PLACEHOLDER64 = "data:image/png;base64,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";

@Component({
  selector: 'image-element',
  templateUrl: './image-element.component.html',
  styleUrls: ['./image-element.component.css'],
  host: {
    class: 'pdfElement',
  }
})
export class PDFImageElement implements OnInit, PDFElementHost<PDFImageElement> {
  element!: PDFElement<PDFImageElement, {}>;
  @HostBinding('style.top') top = '0px';
  @HostBinding('style.left') left = '0px';
  @HostBinding('style.width') width = '50%';

  @ViewChild('imageInput', { static: true }) imageInput!: ElementRef<HTMLInputElement>;
  @ViewChild('image', { static: true }) image!: ElementRef<HTMLImageElement>;


  dragRef!: DragRef;
  isStyleEditorOpen: boolean = false;

  currentImage: string = PLACEHOLDER64;

  constructor(
    private ngxPdfEditorService: NgxPdfEditorService,
    private dragDrop: DragDrop
  ) {
  }

  onClick() {
    this.isStyleEditorOpen = true;
    this.image.nativeElement.focus();
  }

  onBlur(event: FocusEvent) {
    const target = event.relatedTarget as HTMLElement;

    if (!target || !target.classList.contains('unfocusable')) {
      this.dragRef.disabled = false;
      this.isStyleEditorOpen = false;
    } else {
      event.preventDefault();
    }
  }

  ngOnInit(): void {
    if (this.element) {
      this.imageInput.nativeElement.oninput = (ev) => this.setImage(ev);
      this.left = this.element.x;
      this.top = this.element.y;
      this.initializeDrag();
      this.imageInput.nativeElement.click();
    }
  }


  private initializeDrag(): void {
    this.dragRef = this.dragDrop.createDrag(this.element.componentRef.location);
    this.dragRef.withBoundaryElement(this.element.parent);

    this.dragRef.started.subscribe(() => {
      this.isStyleEditorOpen = false;
    });

    this.dragRef.ended.subscribe((_dragRef: any) => {
      this.ngxPdfEditorService.updatePosition<PDFImageElement>(this.element);
      _dragRef.source.reset();
      this.isStyleEditorOpen = true;
    });
  }

  export(): PDFElementJSON {
    return this.ngxPdfEditorService.export<PDFImageElement>(this.element);
  }

  deleteElement(): void {
    this.ngxPdfEditorService.deleteElement(this.element);
  }

  setImage(ev: Event) {
    const element = ev.target as HTMLInputElement;
    const image = element.files ? element.files[0] : null;
    if (image) {
      this.ngxPdfEditorService.toBase64(image).then(base64Image => {
        this.currentImage = base64Image as string;
        this.element.value = this.currentImage;
        this.width = '50%';
        this.element.width = `${this.image.nativeElement.width}px`;
        this.element.height = `${this.image.nativeElement.height}px`;
        this.ngxPdfEditorService.updatePosition<PDFImageElement>(this.element);
        this.image.nativeElement.click();
      });
    }
  }

  updateDimension(event: Event) {
    const target = event.target as HTMLInputElement;
    this.width = `${target.value}%`;
    this.element.width = `${this.image.nativeElement.width}px`;
    this.element.height = `${this.image.nativeElement.height}px`;
    this.ngxPdfEditorService.updatePosition<PDFImageElement>(this.element);
    this.image.nativeElement.focus();
  }

}
