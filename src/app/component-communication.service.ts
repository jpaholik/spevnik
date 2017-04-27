import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class ComponentCommunicationService {

  constructor() { }

  currSongId = new BehaviorSubject<number>(undefined);
  currPlaylistId = new BehaviorSubject<number>(undefined);
  fontSizeOp = new BehaviorSubject<string>('');
  chordSizeOp = new BehaviorSubject<string>('');
  searchTerm = new BehaviorSubject<string>('');

  setCurrSongId(newId: number) {
    this.currSongId.next(newId);
  }

  setCurrPlaylistId(newId: number) {
    this.currPlaylistId.next(newId);
  }

  changeFontSize(how: string) {
    this.fontSizeOp.next(how);
  }

  changeChordSize(how: string) {
    this.chordSizeOp.next(how);
  }

  setSearchTerm(newTerm: string) {
    this.searchTerm.next(newTerm);
  }
}
