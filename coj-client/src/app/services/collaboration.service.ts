import { Injectable } from '@angular/core';
import { COLORS } from '../../assets/colors';

declare let io: any;
declare let ace: any;

@Injectable()
export class CollaborationService {
  clientInfo: Object = {};
  clientNum = 0;
  collaborationSocket: any;

  constructor() { }

  // init() {
  //   this.collaborationSocket = io(window.location.origin, { query : 'message=hehe'});
  //
  //   this.collaborationSocket.on('message', (message) => {
  //       console.log('message received from server ' + message);
  //   });
  // }

  init(sessionId: string, editor: any) {
    this.collaborationSocket = io(window.location.origin, { query : 'sessionId=' + sessionId});

    this.collaborationSocket.on('change', (delta) => {
      delta = JSON.parse(delta);
      editor.lastAppliedChange = delta;
      editor.getSession().getDocument().applyDeltas([delta]);
    });

    this.collaborationSocket.on('cursorMove', (cursor) => {
      const session = editor.getSession();
      cursor = JSON.parse(cursor);
      const socketId = cursor['socketId'];
      const x = cursor['row'];
      const y = cursor['column'];

      if (socketId in this.clientInfo) {
        session.removeMarker(this.clientInfo[socketId]['marker']);
      } else {
        this.clientInfo[socketId] = {};
        const css = document.createElement('style');
        css.type = 'text/css';
        css.innerHTML = `
          .editor_cursor_${socketId}
            {
              position: absolute;
              background: ${COLORS[this.clientNum]};
              z-index: 100;
              width: 3px !important
            }`;
        document.body.appendChild(css);
        this.clientNum++;
      }

      const Range = ace.require('ace/range').Range;
      const newMarker = session.addMarker(new Range(x, y, x, y + 1), `editor_cursor_${socketId}`, true);
      this.clientInfo[socketId]['marker'] = newMarker;
    });
  }

  change(delta: string) {
    this.collaborationSocket.emit('change', delta);
  }

  cursorMove(cursor: string) {
    this.collaborationSocket.emit('cursorMove', cursor);
  }

  restoreBuffer(): void {
    this.collaborationSocket.emit('restoreBuffer');
  }
}
