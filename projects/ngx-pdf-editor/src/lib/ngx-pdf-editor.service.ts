import { ComponentPortal, ComponentType } from '@angular/cdk/portal';
import { ComponentRef, Injectable } from '@angular/core';
import { PageSizes, PDFDocument, PDFForm, PDFImage, RGB, rgb } from 'pdf-lib';
import { Editor, EditorTool, PDFElement, PDFElementHost, PDFElementJSON, RenderedPage } from './models/Editor';
import { FormTextFieldProps } from './models/Form';

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
    this.toogleMouseTracker();
  }

  previousPage(): void {
    this.editor.selectedPage === 1 ? this.editor.selectedPage = this.editor.pages.length : this.editor.selectedPage--;
    this.toogleMouseTracker();
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
    this.toogleMouseTracker();
  }

  private getCurrentPage(){
    return this.editor.pages.find(p => (p.pageNumber === this.editor.selectedPage)) as RenderedPage;
  }

  private toogleMouseTracker(): void {
    if (this.editor.selectedTool) {
      if (!this.editor.mouseTracker) {
        const trackerPortal = new ComponentPortal(this.editor.selectedTool?.mouseTrackerType);
        console.log(this.editor.pages);
        const pagePortalOutlet = this.getCurrentPage().portalOutlet;
        const outletElement = pagePortalOutlet.outletElement as HTMLElement;
        this.editor.mouseTracker = pagePortalOutlet.attachComponentPortal(trackerPortal);
        const mouseTrackerElement = (this.editor.mouseTracker.location.nativeElement as HTMLElement);
        mouseTrackerElement.style.position = 'absolute';
        mouseTrackerElement.style.opacity = '40%';
        mouseTrackerElement.style.pointerEvents = "none";
        outletElement.onmousemove = (ev: MouseEvent) => {
          const target = ev.target as HTMLElement;
          if (target.tagName === 'CANVAS') {
            mouseTrackerElement.style.top = `${ev.offsetY}px`;
            mouseTrackerElement.style.left = `${ev.offsetX}px`;
          } else {
            mouseTrackerElement.style.visibility = 'hidden';
          }
        };

        outletElement.onmouseout = () => {
          mouseTrackerElement.style.visibility = 'hidden';
        };

        outletElement.onmouseover = () => {
          mouseTrackerElement.style.visibility = 'visible';
        };

      } else {
        this.editor.mouseTracker.destroy();
        this.editor.mouseTracker = null;
        this.toogleMouseTracker();
      }
    } else {
      this.editor.mouseTracker?.destroy();
      this.editor.mouseTracker = null;
    }

  }

  unselectTool(): void {
    this.editor.selectedTool = null;
    this.toogleMouseTracker();
  }

  addElement<T, J = {}>(component: ComponentType<T>, event: MouseEvent, value?: string, props?: J, render?: boolean): void {
    const currentPage = this.getCurrentPage();
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
      componentRef: ((currentPage.portalOutlet.attachComponentPortal(portal) as unknown) as ComponentRef<PDFElementHost<T, J>>),
      componentPortal: portal,
      render: render ? render : false,
      fontSize: '16px',
      textColor: '#000000',
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

  export<T, J = {}>(element: PDFElement<T, J>): PDFElementJSON<J> {
    const elementToJson: PDFElementJSON<J> = {
      id: element.id,
      value: element.value,
      width: this.pxStringToNumber(element.width),
      height: this.normalizeDimension(this.pxStringToNumber(element.height)),
      x: this.normalizeDimension(this.pxStringToNumber(element.x)),
      y: this.normalizeDimension(this.pxStringToNumber(element.y)),
      page: element.page,
      type: element.type,
      render: element.render,
      fontSize: this.normalizeDimension(this.pxStringToNumber(element.fontSize)),
      textColor: element.textColor,
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
      elementsToRender.forEach(async el => {
        const page = origin.getPage(el.page - 1);
        const form = origin.getForm();
        switch (el.type) {
          case 'text':
            page.drawText(el.value, {
              x: el.x,
              y: this.yToPdfOrigin(el.y, page.getHeight(), el.fontSize),
              maxWidth: el.width,
              color: this.HEXtoRGB(el.textColor),
              size: el.fontSize
            });
            break;
          case 'image':
            console.log(el.value);
            const img = await (el.value.includes('jpeg') ? origin.embedJpg(el.value) : origin.embedPng(el.value));
            const scaled = img.scaleToFit(this.normalizeDimension(el.width), el.height);
            page.drawImage(img, {
              width: scaled.width,
              height: scaled.height,
              x: el.x,
              y: this.yToPdfOrigin(el.y, page.getHeight(), this.normalizeDimension(scaled.height)),
            })
            break;
            case 'textfield':
              const field = form.createTextField(el.value);
              (el.props as FormTextFieldProps).required ? field.enableRequired() : null;
              field.addToPage(page, {
                  x: el.x,
                  y: this.yToPdfOrigin(el.y, page.getHeight(), el.height / 2),
                  width: this.normalizeDimension(el.width),
                  height: this.normalizeDimension(el.height),
                  textColor: this.HEXtoRGB(el.textColor)
              });
              break;
        }
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

  // async addBlankPage() {
  //   if (this.originalFile) {
  //     const pdfbase64 = await this.toBase64(this.originalFile) as string;
  //     const origin = await PDFDocument.load(pdfbase64);
  //     origin.addPage(PageSizes.A4);
  //     const newPdf = await origin.save();
  //     this.originalFile = new File([newPdf], this.originalFile.name, { type: this.originalFile.type });
  //     this.editor.pdf = await this.toBase64(this.originalFile) as string;
  //   } else {
  //     throw Error('No PDF found!')
  //   }
  // }


  //FORM UTILS
    getInputCounter(): number{
      return this.editor.elements.filter(el => el.type === "textfield").length;
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

  HEXtoRGB(hex: string): RGB {
    const aRgbHex = hex.replace('#', '').match(/.{1,2}/g);
    if (aRgbHex) {
      return rgb(parseInt(aRgbHex[0], 16) / 255, parseInt(aRgbHex[1], 16) / 255, parseInt(aRgbHex[2], 16) / 255);
    }
    return rgb(0, 0, 0);
  }


}
