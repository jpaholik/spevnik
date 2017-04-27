import { Component, OnInit } from '@angular/core';
import { DBService } from '../db.service';

@Component({
  selector: 'app-playlist-list',
  templateUrl: './playlist-list.component.html',
  styleUrls: ['./playlist-list.component.css']
})
export class PlaylistListComponent implements OnInit {

  playlists;

  constructor(private dbService: DBService) { }

  ngOnInit() {
    this.dbService.getPlaylists()
      .subscribe(data => {this.playlists = data; console.log(data);});
  }

}
