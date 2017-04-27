import { Component, OnInit } from '@angular/core';
import { DBService } from '../db.service';
import { Song } from '../song/song';
import { AuthService } from '../auth.service';
import { ComponentCommunicationService } from '../component-communication.service';
import { FilterPipe } from '../filter.pipe';

@Component({
  selector: 'song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.css']
})
export class SongListComponent implements OnInit {

  songs: Song[];
  searchTerm: string;

  constructor(
    private dbService: DBService,
    private authService: AuthService,
    private communicationService: ComponentCommunicationService
  ) {}

  ngOnInit() {
    this.dbService.getSongs()
      .subscribe(data => this.songs = data);

    this.communicationService.searchTerm
      .subscribe(data => this.searchTerm = data);
  }

}
