import { PDFPageProxy } from "ng2-pdf-viewer";
import { PageViewport } from "pdfjs-dist/types/display/display_utils";

export interface EditorConfig {
    title?: string;
    file?: File;

}

export interface RenderedPage {
    cssTransform: boolean,
    error: string | null,
    pageNumber: number,
    source: PDFPageView,
    timestamp: number
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

export class Editor {
    tools: EditorBasicTools = EDITOR_BASIC_TOOLS;
    selectedTool: EditorTool | null = null;
    elements: PDFElement[] = [];
    currentElement: PDFElement | null = null;
}

export interface EditorTool {
    id: number;
    type: string;
    name: string;
    icon: string;
    callback: (event: MouseEvent) => void;
    props: any | null;
}



export interface PDFElement {
    id: number,
    width: string;
    height: string;
    x: string;
    y: string;
    type: string;
    elementRef: HTMLElement;
    parent: HTMLDivElement,
}

export interface EditorBasicTools {
    textField: EditorTool;
}

export const EDITOR_BASIC_TOOLS = {
    textField: {
        id: 0,
        type: 'text',
        name: 'Text',
        icon: 'text_fields',
        callback: () => { },
        props: null
    }
}