import { Component } from '@angular/core';
import { NavbarComponent } from './navbar/navbar.component';
import { SongComponent } from './song/song.component';
import { ComponentCommunicationService } from './component-communication.service';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ ComponentCommunicationService ]
})
export class AppComponent {
  constructor(private authService: AuthService) {}
}
