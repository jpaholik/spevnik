import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { DBService } from '../db.service';
import { ComponentCommunicationService } from '../component-communication.service';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit {

  playlist;

  constructor(
    private dbService: DBService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private communicationService: ComponentCommunicationService
  ) { }

  ngOnInit() {
    this.route.params
      .switchMap((params: Params) => this.dbService.getPlaylist(+params['id']))
      .subscribe(playlist => {
        this.playlist = playlist;
        this.communicationService.setCurrPlaylistId(this.playlist.id);
        console.log(this.playlist);
      });
  }

}
