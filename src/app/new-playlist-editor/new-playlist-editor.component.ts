import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { DBService } from '../db.service';
import { Song } from '../song/song';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-new-playlist-editor',
  templateUrl: './new-playlist-editor.component.html',
  styleUrls: ['./new-playlist-editor.component.css']
})
export class NewPlaylistEditorComponent implements OnInit {

  playlist;
  allSongs;
  newSongInput;
  formGroup: FormGroup;

  constructor(
    private dbService: DBService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private formBuilder: FormBuilder
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.allSongs = [];
    this.playlist = {};

    this.route.params
      .switchMap((params: Params) => this.dbService.getSongs())
      .subscribe(songs => {
        this.allSongs = songs;
      });
  }

  createForm() {
    this.formGroup = this.formBuilder.group({
      name: ['', Validators.required],
      songs: this.formBuilder.array([])
    });
  }

  get songs(): FormArray {
    return this.formGroup.get('songs') as FormArray;
  };

  addSong(song) {
    this.songs.push(this.formBuilder.group(song));
  }

  removeSong(i: number) {
    this.songs.removeAt(i);
  }

  songSelected(newSong) {
    if(newSong) {
      this.addSong(newSong);
    }
  }

  save() {
    const formModel = this.formGroup.value;

    const songIds = formModel.songs.map(
      (song) => {
        return {'id': song.id}
      }
    );

    let objToSend = {
      'id': undefined,
      'name': formModel.name,
      'songIds': songIds
    };
    //console.log(objToSend);

    this.dbService.updatePlaylist(objToSend)
      .subscribe((res: Response) => {console.log(res)});
  }
}
