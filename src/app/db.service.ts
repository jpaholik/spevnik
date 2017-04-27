import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Song } from './song/song';
import { Observable } from 'rxjs/Rx';
import { AuthHttp } from 'angular2-jwt';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class DBService {

  songsGetURL = 'http://spevnik.smefata.sk/api/public/get/songs';
  songGetURL = 'http://spevnik.smefata.sk/api/public/get/song';
  songInsertURL = 'http://spevnik.smefata.sk/api/private/insert/song';
  songUpdateURL = 'http://spevnik.smefata.sk/api/private/update/song';

  playlistsGetURL = 'http://spevnik.smefata.sk/api/private/get/playlists';
  playlistGetURL = 'http://spevnik.smefata.sk/api/private/get/playlist';
  playlistInsertURL = 'http://spevnik.smefata.sk/api/private/insert/playlist';
  playlistUpdateURL = 'http://spevnik.smefata.sk/api/private/update/playlist';

  constructor(
    private http: Http,
    private authHttp: AuthHttp
  ) { }

  getSongs(): Observable<Song[]> {
    return this.http.get(this.songsGetURL)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Chyba servera.'));
  }

  getSong(id: number): Observable<Song> {
    var headers = new Headers({ 'Content-Type': 'application/json' });
    var body = JSON.stringify({"id": id});

    return this.http.post(this.songGetURL, body, { headers: headers })
      .map((response: Response) => {
        var result = response.json();
        console.log(result);
        return result;
      })
      .catch(this.handleError);
  }

  /** insert new song or update existing */
  updateSong(song: Song) {
    console.log(song);
    var headers = new Headers({ 'Content-Type': 'application/json' });
    var body = JSON.stringify(song);

    let url: string;
    if(song.id == undefined) {
      url = this.songInsertURL;
    }
    else {
      url = this.songUpdateURL;
    }

    return this.authHttp.post(url, body, { headers: headers })
      .map((response: Response) => {
        var result = response.json();
        console.log(result);
        return result;
      })
      .catch(this.handleError);
  }

  getPlaylists(): Observable<any> {
    return this.authHttp.get(this.playlistsGetURL)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Chyba servera.'));
  }

  getPlaylist(id: number): Observable<any> {
    var headers = new Headers({ 'Content-Type': 'application/json' });
    var body = JSON.stringify({"id": id});

    return this.authHttp.post(this.playlistGetURL, body, { headers: headers })
      .map((response: Response) => {
        var result = response.json();
        return result;
      })
      .catch(this.handleError);
  }

  /** insert new playlist or update existing */
  updatePlaylist(playlist) {
    console.log('updatePlaylist');
    var headers = new Headers({ 'Content-Type': 'application/json' });
    var body = JSON.stringify(playlist);

    let url;
    if(playlist.id == undefined) {
      url = this.playlistInsertURL;
    }
    else {
      url = this.playlistUpdateURL;
    }

    return this.authHttp.post(url, body, { headers: headers })
      .map((response: Response) => {
        console.log(response);
        var result = response.json();

        console.log(result);
        return result;
      })
      .catch(this.handleError);
  }

  private handleError(error: Response) {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }
}
