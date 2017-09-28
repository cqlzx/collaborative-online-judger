import { Injectable } from '@angular/core';

declare let io: any;

@Injectable()
export class CollaborationService {
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
  }

  change(delta: string) {
    this.collaborationSocket.emit('change', delta);
  }
}
