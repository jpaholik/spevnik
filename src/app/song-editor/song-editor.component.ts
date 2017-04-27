import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DBService } from '../db.service';
import { ComponentCommunicationService } from '../component-communication.service';
import { Song } from '../song/song';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-song-editor',
  templateUrl: './song-editor.component.html',
  styleUrls: ['./song-editor.component.css']
})
export class SongEditorComponent implements OnInit {

  song: Song;
  formGroup: FormGroup;

  constructor(
    private dbService: DBService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private formBuilder: FormBuilder,
    private communicationService: ComponentCommunicationService
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.route.params
      .switchMap((params: Params) => this.dbService.getSong(+params['id']))
      .subscribe(song => {
        this.song = song;
        this.communicationService.setCurrSongId(this.song.id);
        this.setFormValues();
      });
  }

  createForm() {
    this.formGroup = this.formBuilder.group({
      title: ['', Validators.required],
      artist: ['', Validators.required],
      lyrics: ['', Validators.required],
      tags: ['', Validators.required]
    });
  }

  setFormValues() {
    this.formGroup.setValue({
      title: this.song.title,
      artist: this.song.artist,
      lyrics: this.song.lyrics,
      tags: this.song.tags
    });
  }

  prepareSaveSong() : Song {
    const formModel = this.formGroup.value;

    const saveSong: Song = {
      id: this.song.id,
      title: formModel.title as string,
      artist: formModel.artist as string,
      lyrics: formModel.lyrics as string,
      tags: formModel.tags as string
    };

    return saveSong;
  }

  update() {
    console.log('update');
    this.dbService.updateSong(this.prepareSaveSong())
      .subscribe((res: Response) => {console.log(res)});
  }

  writeResult(response) {
    if(response.status == 'ok') {
      
    }
  }
}
