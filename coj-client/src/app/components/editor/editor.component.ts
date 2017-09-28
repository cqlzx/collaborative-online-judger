import { Component, OnInit } from '@angular/core';
import { CollaborationService } from '../../services/collaboration.service';

declare let ace: any;

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  editor: any;
  language = 'Java';
  languages: string[] = ['Java', 'Python', 'Javascript'];
  defaultContent = {
    'Java': `public class Solution {
    public static void main(String[] args) {
        //Your code starts here...
    }
}`,
    'Python': `class Solution(object):
    def main():
        # Your code start here...`,
    'Javascript': `var solution = function() {
    //Your code start here...
};`
  };

  constructor(
    private collaborationService: CollaborationService
  ) { }

  ngOnInit() {
    this.editor = ace.edit('editor');
    this.editor.setTheme('ace/theme/textmate');
    this.editor.$blockScrolling = Infinity;
    this.setLanguage(this.language);

    this.collaborationService.init();
  }

  setLanguage(language: string) {
    this.language = language;
    this.editor.getSession().setMode('ace/mode/' + this.language.toLocaleLowerCase());
    this.resetEditor();
  }

  resetEditor() {
    this.editor.setValue(this.defaultContent[this.language]);
  }

  submit() {
    const userCode = this.editor.getValue();
    console.log(userCode);

  }
}
