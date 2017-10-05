import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

import { CollaborationService } from '../../services/collaboration.service';
import { DataService } from '../../services/data.service';
import { DEFAULT_CODES } from './default.codes';

declare let ace: any;

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  buildMessage = '';
  outputMessage = '';
  editor: any;
  sessionId: string;
  language = 'Java';
  languages: string[] = ['Java', 'Python', 'Javascript'];
  defaultContent = DEFAULT_CODES;

  constructor(
    private collaborationService: CollaborationService,
    private dataService: DataService,
    private route: ActivatedRoute,
    private spinner: Ng4LoadingSpinnerService
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
    this.buildMessage = '';
    this.outputMessage = '';
    this.editor.setValue(this.defaultContent[this.language]);
  }

  submit() {
    this.spinner.show();
    const userCode = this.editor.getValue();
    // console.log(userCode);
    const data = {
      'language': this.language.toLocaleLowerCase(),
      'code': userCode
    };

    this.dataService.submitCode(data)
      .then((result) => {
        this.spinner.hide();
        this.buildMessage = 'Build: ' + result.buildMessage;
        this.outputMessage = 'Output: ' + result.outputMessage;
      })
      .catch(error => console.log(error));
  }
}
