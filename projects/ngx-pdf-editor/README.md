# Ngx Pdf Editor
## _Angular Customizable Pdf Editor_
## Work in progress - Documentation not ready!
[![Angular](https://img.shields.io/badge/%20-Angular%20Material-blue?style=for-the-badge&logo=angular)]()
[![Lending Solution](https://img.shields.io/badge/Powered%20By-Lending%20Solution-ff69b4?style=for-the-badge)](https://www.lendingsolution.it)

### Require Angular 12+

## Install

```
npm install ngx-pdf-editor
```

## Configuration
Import **NgxPdfEditorService** in constructor.

Add Tool to Editor
```ts
this.pdfEditorService.addTool(
      new EditorTool('text',
        'Testo',
        'text_fields',
        (event) => this.pdfEditorService.addElement<PDFTextElement>(PDFTextElement, event, undefined, undefined, true),
        PDFTextElement)
    );
```

## Basic Tools Included
- PDFTextElement
- PDFImageElement
- PDFSignatureElement

## Open Editor
```ts
const config: MatDialogConfig = new MatDialogConfig();

const editorConfig: EditorConfig = {
      title: "Editor PDF",
      file: {{yourFile}} (it must be a File object)
    }
    
config.data = editorConfig;

this.matDialog.open(NgxPdfEditorComponent, config);
```

## License
MIT


