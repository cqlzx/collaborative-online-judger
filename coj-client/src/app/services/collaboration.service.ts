import { Injectable } from '@angular/core';

declare let io: any;

@Injectable()
export class CollaborationService {
  collaborationSocket: any;

  constructor() { }

  init() {
    this.collaborationSocket = io(window.location.origin, { query : 'message=hehe'});

    this.collaborationSocket.on('message', (message) => {
        console.log('message received from server ' + message);
    });
  }
}
