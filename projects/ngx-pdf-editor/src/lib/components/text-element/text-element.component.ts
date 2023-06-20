import { DragDrop, DragRef } from '@angular/cdk/drag-drop';
import { Component, ElementRef, HostBinding, Input, OnInit, ViewChild } from '@angular/core';
import { PDFElement, PDFElementHost, PDFElementJSON } from '../../models/Editor';
import { NgxPdfEditorService } from '../../ngx-pdf-editor.service';

@Component({
  selector: 'pdf-text-element',
  templateUrl: './text-element.component.html',
  styleUrls: ['./text-element.component.css'],
  host: {
    class: 'pdfElement textElement',
  }
})
export class PDFTextElement implements OnInit, PDFElementHost<PDFTextElement> {
  @Input() element!: PDFElement<PDFTextElement>;
  @HostBinding('style.left') left = '0px';
  @HostBinding('style.top') top = '0px';
  @HostBinding('style.fontSize') fontSize = '16px';
  @HostBinding('style.color') textColor = '#000000';

  // @HostBinding('style.fontWeight') fontWeight = 'normal';

  @ViewChild('text', { static: true }) text!: ElementRef<HTMLParagraphElement>;

  contentEditable: boolean = false;

  dragRef!: DragRef;

  isStyleEditorOpen: boolean = false;

  constructor(
    private ngxPdfEditorService: NgxPdfEditorService,
    private dragDrop: DragDrop,
  ) {
  }

  onClick() {
    this.isStyleEditorOpen = true;
  }

  onDoubleClick() {
    this.onClick();
    this.contentEditable = true;
    this.dragRef.disabled = true;
    this.placeCaretAtEnd();
  }

  onBlur(event: FocusEvent) {
    console.log(event);
    const target = event.relatedTarget as HTMLElement;
    if (!target || !target.classList.contains('unfocusable')) {
      this.contentEditable = false;
      this.dragRef.disabled = false;
      this.element.value = this.text.nativeElement.textContent || '';
      this.isStyleEditorOpen = false;
    } else {
      event.preventDefault();
      this.text.nativeElement.focus();
    }
  }

  ngOnInit(): void {
    if (this.element) {
      this.left = this.element.x;
      this.top = this.element.y;
      this.initializeDrag();
      setTimeout(() => this.onDoubleClick(), 10);
    }
    // this.onDoubleClick();
  }


  private initializeDrag(): void {
    this.dragRef = this.dragDrop.createDrag(this.element.componentRef.location);
    this.dragRef.withBoundaryElement(this.element.parent);

    this.dragRef.started.subscribe(() => {
      this.isStyleEditorOpen = false;
    });

    this.dragRef.ended.subscribe((_dragRef: any) => {
      this.ngxPdfEditorService.updatePosition<PDFTextElement>(this.element);
      _dragRef.source.reset();
      this.isStyleEditorOpen = true;
    })
  }



  private placeCaretAtEnd(): void {
    const selection = window.getSelection();
    const range = document.createRange();
    selection?.removeAllRanges();
    range.selectNodeContents(this.text.nativeElement);
    range.collapse(false);
    selection?.addRange(range);
    this.text.nativeElement.focus();
  }

  export(): PDFElementJSON {
    return this.ngxPdfEditorService.export<PDFTextElement>(this.element);
  }

  // setFontBold() {
  //   this.fontWeight === 'normal' ? this.fontWeight = 'bold' : this.fontWeight = 'normal';
  // }

  setFontSize(n: number) {
    this.fontSize = `${Number.parseInt(this.fontSize.replace('px', '')) + n}px`;
    this.element.fontSize = this.fontSize;
  }

  changeTextColor(event: Event) {
    const target = event.target as HTMLInputElement;
    this.textColor = target.value;
    this.element.textColor = this.textColor;
  }

  deleteElement(): void {
    this.ngxPdfEditorService.deleteElement(this.element);
  }

}
