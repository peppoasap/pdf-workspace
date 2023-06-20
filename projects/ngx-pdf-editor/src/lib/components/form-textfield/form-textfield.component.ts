import { DragRef, DragDrop } from '@angular/cdk/drag-drop';
import { Component, ElementRef, HostBinding, Input, OnInit, ViewChild } from '@angular/core';
import { PDFElement, PDFElementHost, PDFElementJSON } from '../../models/Editor';
import { FormTextFieldProps } from '../../models/Form';
import { NgxPdfEditorService } from '../../ngx-pdf-editor.service';
import { PDFTextElement } from '../text-element/text-element.component';

@Component({
  selector: 'lib-form-textfield',
  templateUrl: './form-textfield.component.html',
  styleUrls: ['./form-textfield.component.css'],
  host: {
    class: 'pdfElement',
  }
})
export class PDFFormTextfieldElement implements OnInit, PDFElementHost<PDFFormTextfieldElement> {

  @Input() element!: PDFElement<PDFFormTextfieldElement, FormTextFieldProps>;
  @HostBinding('style.left') left = '0px';
  @HostBinding('style.top') top = '0px';

  @ViewChild('textfield', { static: true }) textfield!: ElementRef<HTMLInputElement>;

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
    this.dragRef.disabled = true;
  }

  onBlur(event: FocusEvent) {
    console.log(event);
    const target = event.relatedTarget as HTMLElement;
    if (!target || !target.classList.contains('unfocusable')) {
      this.dragRef.disabled = false;
      this.isStyleEditorOpen = false;
    }else {
      event.preventDefault();
      // this.textfield.nativeElement.focus();
    }
  }

  ngOnInit(): void {
    if (this.element) {
      this.left = this.element.x;
      this.top = this.element.y;
      this.initializeDrag();
      this.textfield.nativeElement.name = `${this.textfield.nativeElement.name}_${this.ngxPdfEditorService.getInputCounter()}`;
      this.element.value = this.textfield.nativeElement.name;
      this.element.props = {required: false};
    }
  }


  private initializeDrag(): void {
    this.dragRef = this.dragDrop.createDrag(this.element.componentRef.location);
    this.dragRef.withBoundaryElement(this.element.parent);

    this.dragRef.started.subscribe(() => {
      this.isStyleEditorOpen = false;
    });

    this.dragRef.ended.subscribe((_dragRef: any) => {
      this.ngxPdfEditorService.updatePosition<PDFFormTextfieldElement>(this.element);
      _dragRef.source.reset();
      this.isStyleEditorOpen = true;
    })
  }

  export(): PDFElementJSON {
    return this.ngxPdfEditorService.export<PDFFormTextfieldElement, FormTextFieldProps>(this.element);
  }


  deleteElement(): void {
    this.ngxPdfEditorService.deleteElement(this.element);
  }

  changeInputName(event: Event){
    const name = (event.target as HTMLInputElement).value;
    this.textfield.nativeElement.name = name;
    this.element.value = name;
  }

  changeRequired(event: Event){
    if(this.element.props){
      this.element.props.required = (event.target as HTMLInputElement).checked;
    }
    this.textfield.nativeElement.focus();
  }
}
