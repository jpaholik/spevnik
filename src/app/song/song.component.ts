import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { DBService } from '../db.service';
import { ComponentCommunicationService } from '../component-communication.service';
import 'rxjs/add/operator/switchMap';

import { Song } from '../song/song';

@Component({
  selector: 'app-song',
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.css'],
})
export class SongComponent implements OnInit {

  song: Song;
  communicationData;
  fontSize: number = 1;
  chordSize: number = 20;

  constructor(
    private dbService: DBService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private communicationService: ComponentCommunicationService
  ) { }

  ngOnInit() {
    this.route.params
      .switchMap((params: Params) => this.dbService.getSong(+params['id']))
      .subscribe(song => {
        this.song = song;
        this.communicationService.setCurrSongId(this.song.id);
        this.formatSong();
      });

    this.communicationService.fontSizeOp
      .subscribe((how) => this.changeFontSize(how));

    this.communicationService.chordSizeOp
      .subscribe((how) => this.changeChordSize(how));
  }

  formatSong() {
    let words = this.song.lyrics.split("*");
    let first_char = this.song.lyrics.substring(0, 1);

    let counter: number = 0;
    let lyrics: string = '';
    let chord_started: boolean = false;

    for (let word of words) {
      if (counter == 0 && word == '') continue;

      if (counter == 0) {
        counter++;
        if (first_char != '*') {
          lyrics += word;
          //echo 'continue';
          continue;
        }
      }

      if (!chord_started) {
        let chord_idx: number = undefined;
        let chord = word.split("|");
        let chord_main = chord[0].trim().toLowerCase();

        let chord_arr = [];
        chord_arr[0] = ['c'];
        chord_arr[1] = ['cis'];
        chord_arr[2] = ['d'];
        chord_arr[3] = ['dis'];
        chord_arr[4] = ['e'];
        chord_arr[5] = ['f'];
        chord_arr[6] = ['fis'];
        chord_arr[7] = ['g'];
        chord_arr[8] = ['gis'];
        chord_arr[9] = ['a'];
        chord_arr[10] = ['ais', 'b'];
        chord_arr[11] = ['h'];

        for (let _i = 0; _i < chord_arr.length; _i++) {
          for(let _j = 0; _j < chord_arr[_i].length; _j++) {
            if (chord_main == chord_arr[_i][_j]) {
              chord_idx = _i;
            }
          }
        }

        let chord_dur = !this.isLowerCase(chord[0]) ? "true" : "false";
        console.log(chord[0]);

        lyrics += '<sup data-chord-idx="' + chord_idx + '" data-chord-dur="' + chord_dur + '" class="chord-main">' + chord[0];
        if (chord[1]) {
          lyrics += '</sup>';
          lyrics += '<sup class="chord">' + chord[1];
        }
        chord_started = true;
      }
      else {
        lyrics += '</sup>';
        chord_started = false;
        lyrics += word;
      }
    }

    if (chord_started) {
      lyrics += '</sup>';
    }

    this.song.lyrics = lyrics.replace(new RegExp('\r?\n','g'), '<br />');;
  }

  isLowerCase(str: string): boolean {
    for (let _i = 0; _i < str.length; _i++) {
      if (str.charAt(_i) != str.charAt(_i).toLowerCase()) {
        return false;
      }
    }

    return true;
  }

  changeFontSize(how: string) {
    if(how == 'plus') {
      this.fontSize += 0.1;
    }
    else if(how == 'minus') {
      this.fontSize -= 0.1;
    }
  }

  changeChordSize(how: string) {
    if(how == 'plus') {
      this.chordSize += 1;
    }
    else if(how == 'minus') {
      this.chordSize -= 1;
    }
  }
}
