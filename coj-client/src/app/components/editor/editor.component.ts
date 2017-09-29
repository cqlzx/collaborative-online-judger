import { Component, OnInit } from '@angular/core';
import { CollaborationService } from '../../services/collaboration.service';
import { ActivatedRoute, Params } from '@angular/router';

declare let ace: any;

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  editor: any;
  sessionId: string;
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
    private collaborationService: CollaborationService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.sessionId = params['id'];
      this.initEditor();
    });
  }

  initEditor() {
    this.editor = ace.edit('editor');
    this.editor.setTheme('ace/theme/textmate');
    this.editor.$blockScrolling = Infinity;
    this.setLanguage(this.language);

    this.collaborationService.init(this.sessionId, this.editor);

    this.editor.lastAppliedChange = null;

    this.editor.on('change', (e) => {
      // console.log('change from client' + JSON.stringify(e));
      if (this.editor.lastAppliedChange != e) {
        this.collaborationService.change(JSON.stringify(e));
      }
    });

    this.editor.getSession().getSelection().on('changeCursor', () => {
      const cursor = this.editor.getSession().getSelection().getCursor();
      // console.log('client cursor move: ' + JSON.stringify(cursor));
      this.collaborationService.cursorMove(JSON.stringify(cursor));
    });

    this.collaborationService.restoreBuffer();
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
