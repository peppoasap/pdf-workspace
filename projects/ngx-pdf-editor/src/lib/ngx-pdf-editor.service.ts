import { ComponentPortal, ComponentType } from '@angular/cdk/portal';
import { ComponentRef, Injectable } from '@angular/core';
import { PDFDocument, rgb } from 'pdf-lib';
import { Editor, EditorTool, PDFElement, PDFElementHost, PDFElementJSON } from './models/Editor';

@Injectable({
  providedIn: 'root'
})
export class NgxPdfEditorService {
  static idCounter: number = 0;
  private editor: Editor = new Editor();
  originalFile: File | undefined;

  constructor() {

  }

  fileToURL(file: File): string {
    return URL.createObjectURL(file);
  }

  toBase64 = (file: File) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  getPDF(): string | null {
    return this.editor.pdf;
  }

  setPDF(file: File) {
    this.originalFile = file;
    this.editor.pdf = this.fileToURL(file);
  }

  nextPage(): void {
    this.editor.selectedPage === this.editor.pages.length ? this.editor.selectedPage = 1 : this.editor.selectedPage++;
  }

  previousPage(): void {
    this.editor.selectedPage === 1 ? this.editor.selectedPage = this.editor.pages.length : this.editor.selectedPage--;
  }

  getEditor(): Editor {
    return this.editor;
  }

  addTool(tool: EditorTool): void {
    this.editor.tools.push(tool);
  }

  removeTool(tool: EditorTool): void {
    this.editor.tools = this.editor.tools.filter(t => t.id !== tool.id);
  }

  toggleTool(tool: EditorTool): void {
    this.editor.selectedTool?.id !== tool.id ? this.editor.selectedTool = tool : this.editor.selectedTool = null;
  }

  unselectTool(): void {
    this.editor.selectedTool = null;
  }

  addElement<T, J = {}>(component: ComponentType<T>, event: MouseEvent, value?: string, props?: J, render?: boolean): void {
    const currentPage = this.editor.pages[this.editor.selectedPage - 1];
    const portal = new ComponentPortal(component);
    const element: PDFElement<T, J> = {
      id: NgxPdfEditorService.idCounter++,
      value: value ? value : '',
      x: `${event.offsetX}px`,
      y: `${event.offsetY}px`,
      page: this.editor.selectedPage,
      width: '',
      height: '',
      type: this.editor.selectedTool ? this.editor.selectedTool.type : 'undefined',
      parent: currentPage.source.div,
      componentRef: ((currentPage.portalOutlet.attachComponentPortal(portal) as unknown) as ComponentRef<PDFElementHost<T>>),
      componentPortal: portal,
      render: render ? render : false,
      fontSize: "16px",
      props
    };
    element.width = `${element.componentRef.location.nativeElement.offsetWidth}px`;
    element.height = `${element.componentRef.location.nativeElement.offsetHeight}px`;
    element.componentRef.instance.element = element;
    this.editor.elements.push(element);
    this.unselectTool();
  }

  deleteElement(elementToDelete: PDFElement<any>): void {
    elementToDelete.componentRef.destroy();
    this.editor.elements = this.editor.elements.filter(el => el.id !== elementToDelete.id);
  }

  updatePosition<T>(element: PDFElement<T>): void {
    const bounding = element.componentRef.location.nativeElement.getBoundingClientRect();
    const parentPosition = this.getParentPosition(element.parent);
    element.x = `${bounding.x - parentPosition.left}px`;
    element.y = `${bounding.y - parentPosition.top}px`;
    element.width = `${bounding.width}px`;
    element.height = `${bounding.height}px`;
    element.componentRef.instance.left = element.x;
    element.componentRef.instance.top = element.y;
    console.log("::ELEMENT UPDATED::", element);
  }

  private getParentPosition(parent: HTMLElement) {
    let element = parent;
    let x = 0, y = 0;
    while (element && !isNaN(element.offsetLeft) && !isNaN(element.offsetTop)) {
      x += element.offsetLeft - element.scrollLeft;
      y += element.offsetTop - element.scrollTop;
      element = element.offsetParent as HTMLElement;
    }
    return { left: x, top: y };
  }

  export<T, J = {}>(element: PDFElement<T, J>): PDFElementJSON {
    const elementToJson: PDFElementJSON = {
      id: element.id,
      value: element.value,
      width: this.pxStringToNumber(element.width),
      height: this.normalizeDimension(this.pxStringToNumber(element.height)),
      x: this.normalizeDimension(this.pxStringToNumber(element.x)),
      y: this.normalizeDimension(this.pxStringToNumber(element.y)),
      page: element.page,
      type: element.type,
      render: element.render,
      fontSize: this.pxStringToNumber(element.fontSize),
      props: element.props
    }
    return elementToJson;
  }

  async render() {
    if (this.originalFile) {
      const pdfbase64 = await this.toBase64(this.originalFile) as string;
      const origin = await PDFDocument.load(pdfbase64);
      const elementsJSON = this.editor.elements.map(el => el.componentRef.instance.export(el));
      const elementsToRender = elementsJSON.filter(el => el.render);
      console.log(elementsJSON);
      elementsToRender.forEach(el => {
        const page = origin.getPage(el.page - 1);

        page.drawText(el.value, {
          x: el.x,
          y: this.yToPdfOrigin(el.y, page.getHeight(), el.fontSize),
          maxWidth: el.width,
          color: rgb(0, 0, 0),
          size: el.fontSize
        });
      });

      return { pdf: await origin.saveAsBase64({ dataUri: true }), json: elementsJSON, filename: this.editor.filename }
    } else {
      throw Error('No PDF found!')
    }
  }

  reset(): void {
    this.editor = new Editor();
    this.originalFile = undefined;
    NgxPdfEditorService.idCounter = 0;
  }

  //UTILS
  pxStringToNumber(cord: string): number {
    return Number.parseFloat(cord.replace('px', ''));
  }

  yToPdfOrigin(y: number, height: number, fontSize: number): number {
    return (y + fontSize) * (0 - height) / (height - 0) + height;
  }

  normalizeDimension(dimension: number): number {
    return dimension / this.editor.viewportScale;
  }


}
