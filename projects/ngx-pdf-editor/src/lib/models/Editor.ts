import { ComponentPortal, DomPortalOutlet, Portal } from "@angular/cdk/portal";
import { ComponentRef } from "@angular/core";
import { PDFPageProxy } from "ng2-pdf-viewer";

export interface EditorConfig {
    title?: string;
    file?: File;
}

export interface RenderedPage {
    cssTransform: boolean,
    error: string | null,
    pageNumber: number,
    source: PDFPageView,
    timestamp: number,
    portalOutlet: DomPortalOutlet,
    viewport: PageViewport
}


export interface PDFPageView {
    canvas: HTMLCanvasElement,
    div: HTMLDivElement,
    id: number,
    pdfPage: PDFPageProxy,
    renderer: string,
    renderingId: string,
    scale: number,
    viewport: PageViewport
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
    elements: PDFElement<any>[] = [];
    pdf: string | null = null;
    pages: RenderedPage[] = [];
    selectedPage: number = 1;
    viewportScale: number = 1;
    filename: string = "my-pdf";
}

export class EditorTool {
    static count = 0;
    id: number = EditorTool.count++;
    type!: string;
    name!: string;
    icon!: string;
    callback!: (event: MouseEvent) => void;

    constructor(_type: string, _name: string, _icon: string, _action: (event: MouseEvent) => void) {
        this.type = _type;
        this.name = _name;
        this.icon = _icon;
        this.callback = _action;
    }
}

// J is the props type, but is optional
export interface PDFElement<T, J = {}> {
    id: number,
    value: string,
    width: string,
    height: string,
    x: string,
    y: string,
    page: number,
    type: string,
    parent: HTMLDivElement,
    componentRef: ComponentRef<PDFElementHost<T>>,
    componentPortal: ComponentPortal<T>,
    render: boolean,
    fontSize: string,
    props?: J
}

export type PDFElementJSON = Omit<PDFElement<any>, 'componentRef' | 'componentPortal' | 'parent' | 'width' | 'height' | 'x' | 'y' | 'fontSize'> & {
    width: number,
    height: number,
    x: number,
    y: number,
    fontSize: number
}

export interface PDFElementHost<T> {
    element: PDFElement<T>,
    left: string,
    top: string,
    export: (element: PDFElement<T>) => PDFElementJSON,
    deleteElement: () => void
}

export interface PDFRenderResult {
    pdf: string,
    json: PDFElementJSON[],
    filename: string
}
