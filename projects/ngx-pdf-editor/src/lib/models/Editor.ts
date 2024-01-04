import {
  ComponentPortal,
  ComponentType,
  DomPortalOutlet,
} from '@angular/cdk/portal';
import { ComponentRef } from '@angular/core';

export interface EditorConfig {
  title?: string;
  file?: File;
  language?: string;
}

export interface RenderedPage {
  cssTransform: boolean;
  pageNumber: number;
  source: PDFPageView;
  portalOutlet: DomPortalOutlet;
  viewport: PageViewport;
}

export interface PDFPageView {
  canvas: HTMLCanvasElement;
  div: HTMLDivElement;
  id: number;
  pdfPage: any;
  renderer: string;
  renderingId: string;
  scale: number;
  viewport: PageViewport;
}

// Clone of the pdfjs-dist lib PageViewport Class
export interface PageViewport {
  viewBox: number[];
  scale: number;
  rotation: number;
  offsetX: number;
  offsetY: number;
  transform: number[];
  width: number;
  height: number;
}

export class Editor {
  tools: EditorTool[] = [];
  selectedTool: EditorTool | null = null;
  elements: PDFElement<any, any>[] = [];
  pdf: string | null = null;
  pages: RenderedPage[] = [];
  pagesData: any[] = [];
  selectedPage: number = 1;
  viewportScale: number = 1;
  filename: string = 'my-pdf';
  mouseTracker: ComponentRef<any> | null = null;
}

export class EditorTool {
  static count = 0;
  id: number = EditorTool.count++;
  type!: string;
  name!: string;
  icon!: string;
  callback!: (event: MouseEvent) => void;
  mouseTrackerType!: ComponentType<any>;

  constructor(
    _type: string,
    _name: string,
    _icon: string,
    _action: (event: MouseEvent) => void,
    _mouseTracker: ComponentType<any>
  ) {
    this.type = _type;
    this.name = _name;
    this.icon = _icon;
    this.callback = _action;
    this.mouseTrackerType = _mouseTracker;
  }
}

// J is the props type, but is optional
export interface PDFElement<T, J = {}> {
  id: number;
  value: string;
  width: string;
  height: string;
  x: string;
  y: string;
  page: number;
  type: string;
  parent: HTMLDivElement;
  componentRef: ComponentRef<PDFElementHost<T, J>>;
  componentPortal: ComponentPortal<T>;
  render: boolean;
  fontSize: string;
  textColor: string;
  props?: J;
}

export type PDFElementJSON<J = {}> = Omit<
  PDFElement<any, J>,
  | 'componentRef'
  | 'componentPortal'
  | 'parent'
  | 'width'
  | 'height'
  | 'x'
  | 'y'
  | 'fontSize'
> & {
  width: number;
  height: number;
  x: number;
  y: number;
  fontSize: number;
};

export interface PDFElementHost<T, J = {}> {
  element: PDFElement<T, J>;
  left: string;
  top: string;
  export: (element: PDFElement<T, J>) => PDFElementJSON<J>;
  deleteElement: () => void;
}

export interface PDFRenderResult {
  pdf: string;
  json: PDFElementJSON[];
  filename: string;
}
