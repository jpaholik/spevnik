import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DBService } from '../db.service';
import { Song } from '../song/song';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-new-song-editor',
  templateUrl: './new-song-editor.component.html',
  styleUrls: ['./new-song-editor.component.css']
})
export class NewSongEditorComponent implements OnInit {

  song: Song;
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

    const saveSong = {
      id: undefined,
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
}
