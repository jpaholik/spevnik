import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { DBService } from '../db.service';
import { Song } from '../song/song';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-playlist-editor',
  templateUrl: './playlist-editor.component.html',
  styleUrls: ['./playlist-editor.component.css']
})
export class PlaylistEditorComponent implements OnInit {

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
      .switchMap((params: Params) => this.dbService.getPlaylist(+params['id']))
      .subscribe(playlist => {
        this.playlist = playlist;
        this.setFormValues();
      });

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

  setFormValues() {
    this.formGroup.patchValue({
      name: this.playlist.name,
    });

    const songFGs = this.playlist.songs.map(song => this.formBuilder.group(song));
    const songFormArray = this.formBuilder.array(songFGs);
    this.formGroup.setControl('songs', songFormArray);
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
      'id': this.playlist.id,
      'name': formModel.name,
      'songIds': songIds
    };
    //console.log(objToSend);

    this.dbService.updatePlaylist(objToSend)
      .subscribe((res: Response) => {console.log(res)});
  }
}
