import { DragDrop, Point } from '@angular/cdk/drag-drop';
import { ConnectedPositionStrategy, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { CdkPortal, TemplatePortalDirective } from '@angular/cdk/portal';
import { Component, ElementRef, Inject, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PDFDocumentProxy, PDFPageProxy } from 'ng2-pdf-viewer';
import { Editor, EditorConfig, EditorTool, PDFElement, RenderedPage } from './models/Editor';

@Component({
  selector: 'ngx-pdf-editor',
  templateUrl: './ngx-pdf-editor.component.html',
  styleUrls: ['./ngx-pdf-editor.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class NgxPdfEditorComponent implements OnInit, OnDestroy {

  pdfToEdit: string | null = null;
  pdfRenderCompleted: boolean = false;
  pages: RenderedPage[] = [];
  selectedPage: number = 1;

  editor: Editor = new Editor();

  @ViewChild('textStyleEditor') textStyleEditorTemplate: CdkPortal | undefined;

  constructor(
    @Inject(MAT_DIALOG_DATA) public editorConfig: EditorConfig,
    private dragDrop: DragDrop,
    private overlay: Overlay
  ) {
    if (editorConfig.file) {
      this.pdfToEdit = this.fileToURL(editorConfig.file);
    }

    //Add Listener to tools
    this.editor.tools.textField.callback = (event) => this.addTextElement(event);

  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {

  }

  getEditorToolsArray() {
    return Object.keys(this.editor.tools);
  }

  fileToURL(file: File): string {
    return URL.createObjectURL(file);
  }

  pageRendered(page: any) {
    let pageRendered: RenderedPage = page as RenderedPage;
    this.pages.push(pageRendered);
    console.log("PAGE", pageRendered);

    pageRendered.source.div.onclick = (event) => {
      console.log("EXEC. CLICK EVENT:", event);
      console.log("SELECTED TOOL:", this.editor.selectedTool);
      this.editor.selectedTool?.callback(event);
    }

  }

  nextPage(): void {
    this.selectedPage === this.pages.length ? this.selectedPage = 1 : this.selectedPage++;
  }

  previousPage(): void {
    this.selectedPage === 1 ? this.selectedPage = this.pages.length : this.selectedPage--;
  }

  toggleTool(tool: EditorTool): void {
    this.editor.selectedTool?.id !== tool.id ? this.editor.selectedTool = tool : this.editor.selectedTool = null;
  }

  unselectTool(): void {
    this.editor.selectedTool = null;
  }

  addTextElement(event: MouseEvent) {
    const currentPage = this.pages[this.selectedPage - 1];
    const parent = currentPage.source.div;
    const value = '';
    const textElement = document.createElement('p');
    textElement.textContent = value;
    textElement.style.left = `${event.offsetX}px`;
    textElement.style.top = `${event.offsetY}px`;
    textElement.classList.add('pdfElement', 'textElement');
    const elementDragRef = this.dragDrop.createDrag(textElement);
    elementDragRef.withBoundaryElement(parent);
    parent.appendChild(textElement);
    const element: PDFElement = {
      id: this.editor.elements.length,
      x: textElement.style.left,
      y: textElement.style.top,
      width: `${textElement.offsetWidth}px`,
      height: `${textElement.offsetHeight}px`,
      type: this.editor.selectedTool ? this.editor.selectedTool.type : 'undefined',
      elementRef: textElement,
      parent
    };

    // Event Listeners
    let overlayRef: OverlayRef | null = null;
    textElement.ondblclick = () => {
      this.editor.currentElement = element;
      overlayRef ? overlayRef.dispose() : null;
      elementDragRef.disabled = true;
      textElement.contentEditable = 'true';
      textElement.focus();
      overlayRef = this.openTextStyleOverlay(textElement);
      const sub = overlayRef.outsidePointerEvents().subscribe((event) => {
        event.preventDefault();
        if (event.target !== textElement) {
          this.updateElement(element.id);
          textElement.contentEditable = 'false';
          elementDragRef.disabled = false;
          overlayRef ? overlayRef.dispose() : null;
          overlayRef = null;
          sub.unsubscribe();
          this.editor.currentElement = null;
        }
      });
    }

    textElement.onfocus = () => {
      this.placeCaretAtEnd(textElement);
    }

    elementDragRef.ended.subscribe((_dragRef) => { this.updateElement(element.id); _dragRef.source.reset(); })

    //Before finish
    this.editor.elements.push(element);
    this.unselectTool();
    textElement.dispatchEvent(new MouseEvent('dblclick'));
  }

  updateElement(elementId: number): void {
    const elementToUpdate = this.editor.elements.find(el => el.id === elementId);
    if (elementToUpdate) {
      const bounding = elementToUpdate.elementRef.getBoundingClientRect();
      const parentPosition = this.getParentPosition(elementToUpdate.parent);
      elementToUpdate.x = `${bounding.x - parentPosition.left}px`;
      elementToUpdate.y = `${bounding.y - parentPosition.top}px`;
      elementToUpdate.width = `${bounding.width}px`;
      elementToUpdate.height = `${bounding.height}px`;
      elementToUpdate.elementRef.style.left = elementToUpdate.x;
      elementToUpdate.elementRef.style.top = elementToUpdate.y;
      console.log("::ELEMENT UPDATED::", elementToUpdate);
    } else {
      console.error("!! ELEMENT TO UPDATE NOT FOUND!!");
    }
  }

  private getParentPosition(element: HTMLElement) {
    let x = 0, y = 0;
    while (element && !isNaN(element.offsetLeft) && !isNaN(element.offsetTop)) {
      x += element.offsetLeft - element.scrollLeft;
      y += element.offsetTop - element.scrollTop;
      element = element.offsetParent as HTMLElement;
    }
    return { left: x, top: y };
  }

  private placeCaretAtEnd(element: HTMLElement): void {
    const selection = window.getSelection();
    const range = document.createRange();
    selection?.removeAllRanges();
    range.selectNodeContents(element);
    range.collapse(false);
    selection?.addRange(range);
    element.focus();
  }

  openTextStyleOverlay(element: HTMLElement): OverlayRef {
    const overlayRef = this.overlay.create({
      height: '64px',
      panelClass: ['bg-white', 'rounded-md', 'p-4', 'shadow-md'],
      positionStrategy: this.overlay.position().connectedTo(new ElementRef(element)
        , { originX: 'end', originY: 'bottom' }, { overlayX: 'center', overlayY: 'top' })
    });
    overlayRef.overlayElement.tabIndex = -1;
    overlayRef.attach(this.textStyleEditorTemplate);
    return overlayRef;
  }

  updateTextSize(target: HTMLInputElement) {
    if (this.editor.currentElement) {
      this.editor.currentElement.elementRef.style.fontSize = `${target.value}px`
    }
  }

}
