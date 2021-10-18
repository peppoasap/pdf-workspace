import { Component, Input, OnInit } from '@angular/core';
import { EditorTool } from '../../models/Editor';

@Component({
  selector: 'editor-tool-button',
  templateUrl: './tool-button.component.html',
  styleUrls: ['./tool-button.component.css']
})
export class ToolButtonComponent implements OnInit {
  @Input() tool!: EditorTool;
  @Input() selectedTool!: EditorTool;

  constructor() { }


  ngOnInit(): void {
  }

}
