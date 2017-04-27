import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { ComponentCommunicationService } from '../component-communication.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  title = "Spevník";
  data;
  counter = 0;
  searchTerm: string;

  currSongId: number;
  currPlaylistId: number;

  showButtonAddSong: boolean = false;
  showButtonAddPlaylist: boolean = false;

  showButtonSongList: boolean = false;
  showButtonPlaylistList: boolean = false;

  showButtonEditSong: boolean = false;
  showButtonEditPlaylist: boolean = false;

  showButtonBackToSong: boolean = false;
  showButtonBackToPlaylist: boolean = false;

  showSongManipulators: boolean = false;
  showSearchbar: boolean = false;

  auth0Domain = 'janpaholik.eu';
  apiIdentifier = 'http://spevnik.smefata.sk';
  clientId = '...';
  callbackUrl = 'http://spevnik.smefata.sk/callback';
  nonce: string;
  loginLink = 'https://'+this.auth0Domain+'.auth0.com/'+
    'authorize?scope=full_access&audience='+this.apiIdentifier+
    '&response_type=id_token%20token&client_id='+this.clientId+
    '&redirect_uri='+this.callbackUrl+
    '&nonce='+this.nonce;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private communicationService: ComponentCommunicationService,
    private authService: AuthService
  ) {
    this.nonce = this.authService.generateNonce();
    console.log(this.loginLink);
  }

  ngOnInit() {
    this.router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe(event => this.refreshButtons());

    this.communicationService.currSongId
      .subscribe((id) => this.currSongId = id);

    this.communicationService.currPlaylistId
      .subscribe((id) => this.currPlaylistId = id);
  }

  refreshButtons() {
    let currentRoute = this.route.root;
    while (currentRoute.children[0] !== undefined) {
      currentRoute = currentRoute.children[0];
    }

    let data = currentRoute.snapshot.data;

    let section =
      (data.name == 'songlist' || data.name == 'newsong' || data.name == 'songeditor' || data.name == 'songcomponent')
      ? 'song' : 'playlist';

    // 'show ...' buttons
    this.showButtonPlaylistList = (this.authService.loggedIn()) ? true : false;
    this.showButtonSongList = true;

    // 'add ...' buttons
    this.showButtonAddSong = (section == 'song' && this.authService.loggedIn()) ? true : false;
    this.showButtonAddPlaylist = (section == 'playlist' && this.authService.loggedIn()) ? true : false;

    // 'back to ...' buttons
    this.showButtonBackToSong = (data.name == 'songeditor' && this.currSongId != undefined) ? true : false;
    this.showButtonBackToPlaylist = (data.name == 'playlisteditor' && this.currPlaylistId != undefined && this.authService.loggedIn()) ? true : false;

    // 'edit ...' buttons
    this.showButtonEditSong = (data.name == 'songcomponent' && this.currSongId != undefined && this.authService.loggedIn()) ? true : false;
    this.showButtonEditPlaylist = (data.name == 'playlistcomponent' && this.currPlaylistId != undefined && this.authService.loggedIn()) ? true : false;

    // other buttons and fields
    this.showSongManipulators = data.name == 'songcomponent' ? true : false;
    this.showSearchbar = (data.name == 'songlist') ? true : false;
  }

  transpose(where) {
    console.log('transpose');

  	let chord_arr = [];
  	chord_arr[0] = 'c';
  	chord_arr[1] = 'cis';
  	chord_arr[2] = 'd';
  	chord_arr[3] = 'dis';
  	chord_arr[4] = 'e';
  	chord_arr[5] = 'f';
  	chord_arr[6] = 'fis';
  	chord_arr[7] = 'g';
  	chord_arr[8] = 'gis';
  	chord_arr[9] = 'a';
  	chord_arr[10] = 'ais';
  	chord_arr[11] = 'h';

  	let chords = document.getElementsByClassName("chord-main");

  	for(var i = 0; i < chords.length; i++) {
  		let old_idx = parseInt(chords[i].getAttribute("data-chord-idx"));

      let new_idx;
  		if(where === "up") {
  			new_idx = (old_idx + 1) % 12;
  		}
  		else {
  			new_idx = (old_idx + 12 - 1) % 12;
  		}

  		let new_chord;
  		if(chords[i].getAttribute("data-chord-dur") === "true") {
  			new_chord = chord_arr[new_idx].charAt(0).toUpperCase() + chord_arr[new_idx].slice(1);
  		}
  		else {
  			new_chord = chord_arr[new_idx];
  		}
  		chords[i].setAttribute("data-chord-idx", new_idx);
  		chords[i].innerHTML = new_chord;
	  }
  }

  changeFontSize(how: string) {
    this.communicationService.changeFontSize(how);
  }

  changeChordSize(how: string) {
    this.communicationService.changeChordSize(how);
  }

  loggedIn() {
    return this.authService.loggedIn();
  }

  logout() {
    this.authService.logout();
    this.refreshButtons();
  }

  onSearchTermChange(newSearchTerm) {
    this.communicationService.setSearchTerm(newSearchTerm);
  }
}
