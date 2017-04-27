import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SongListComponent } from './song-list/song-list.component';
import { SongComponent } from './song/song.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

import { DBService } from './db.service';
import { SafeHtmlPipe } from './safe-html.pipe';
import { SongEditorComponent } from './song-editor/song-editor.component';
import { PlaylistEditorComponent } from './playlist-editor/playlist-editor.component';
import { NewSongEditorComponent } from './new-song-editor/new-song-editor.component';
import { SafeCssPipe } from './safe-css.pipe';
import { PlaylistListComponent } from './playlist-list/playlist-list.component';
import { NewPlaylistEditorComponent } from './new-playlist-editor/new-playlist-editor.component';
import { PlaylistComponent } from './playlist/playlist.component';
import { AutoCompleteComponent } from './auto-complete/auto-complete.component';
import { CallbackComponent } from './callback/callback.component';

import { provideAuth, AuthHttp, AuthConfig } from 'angular2-jwt';
import { AuthGuard } from './auth-guard.service';
import { AuthService } from './auth.service';
import { Http, RequestOptions } from '@angular/http';
import { FilterPipe } from './filter.pipe';

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp( new AuthConfig({}), http, options);
}

const appRoutes: Routes = [
  {
    path: 'zoznam',
    component: SongListComponent,
    data: {
      name: 'songlist',
      title: 'Zoznam piesní'
    }
  },
  {
    path: 'zoznam/zoznampiesni',
    component: PlaylistListComponent,
    data: {
      name: 'playlistlist',
      title: 'Zoznamy piesní'
    },
    canActivate: [ AuthGuard ]
  },
  {
    path: 'pridat/piesen',
    component: NewSongEditorComponent,
    data: {
      name: 'newsong',
      title: 'Nová pieseň'
    },
    canActivate: [ AuthGuard ]
  },
  {
    path: 'pridat/zoznampiesni',
    component: NewPlaylistEditorComponent,
    data: {
      name: 'newplaylist',
      title: 'Nový zoznam piesní'
    },
    canActivate: [ AuthGuard ]
  },
  {
    path: 'callback',
    component: CallbackComponent,
  },
  {
    path: 'zobrazit/piesen/:id',
    component: SongComponent,
    data: {
      name: 'songcomponent',
      title: 'Pieseň'
    }
  },
  {
    path: 'zobrazit/zoznampiesni/:id',
    component: PlaylistComponent,
    data: {
      name: 'playlistcomponent',
      title: 'Zoznam piesní'
    },
    canActivate: [ AuthGuard ]
  },
  {
    path: 'upravit/piesen/:id',
    component: SongEditorComponent,
    data: {
      name: 'songeditor',
      title: 'Úprava piesne'
    },
    canActivate: [ AuthGuard ]
  },
  {
    path: 'upravit/zoznampiesni/:id',
    component: PlaylistEditorComponent,
    data: {
      name: 'playlisteditor',
      title: 'Úprava zoznamu piesní'
    },
    canActivate: [ AuthGuard ]
  },
  {
    path: '',
    redirectTo: '/zoznam',
    pathMatch: 'full',
  },
  {
    path: '**',
    component: PageNotFoundComponent,
    data: {
      name: 'pagenotfound',
      title: 'Stránka sa nenašla'
    }
  }
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SongListComponent,
    SongComponent,
    PageNotFoundComponent,
    SafeHtmlPipe,
    SongEditorComponent,
    PlaylistEditorComponent,
    NewSongEditorComponent,
    SafeCssPipe,
    PlaylistListComponent,
    NewPlaylistEditorComponent,
    PlaylistComponent,
    AutoCompleteComponent,
    CallbackComponent,
    FilterPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    DBService,
    AuthService,
    {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [ Http, RequestOptions ]
    },
    AuthGuard
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
