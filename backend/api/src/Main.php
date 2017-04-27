<?php

namespace App;

use Auth0\SDK\JWTVerifier;

class Main {

    protected $token;
    protected $tokenInfo;
    public $db;

    public function setCurrentToken($token) {

        try {
		        $verifier = new JWTVerifier([
				        'supported_algs' => ['RS256'],
				        'valid_audiences' => ['http://spevnik.smefata.sk'],
				        'authorized_iss' => ['https://janpaholik.eu.auth0.com/']
		        ]);

		        $this->token = $token;
		        $this->tokenInfo = $verifier->verifyAndDecode($token);
        }
        catch(\Auth0\SDK\Exception\CoreException $e) {
        	  throw $e;
        }
    }
    
    public function dbConnect() {
        $this->db = new \mysqli("...", "...", "...", "...");
    		if ($this->db->connect_errno) {
    				printf("Connect failed: %s\n", $this->db->connect_error);
    				exit();
    		}
    		if (!$this->db->set_charset("utf8")) {
    				printf("Error loading character set utf8: %s\n", $this->db->error);
    				exit();
    		}
    }

    public function publicPing() {
        return array(
            "status" => "ok",
            "message" => "Hello from a public endpoint! You don't need to be authenticated to see this."
        );
    }

    public function privatePing() {
        return array(
            "status" => "ok",
            "message" => "Hello from a private endpoint! You DO need to be authenticated to see this."
        );
    }
    
    public function getSongs() {
        if ($result = $this->db->query("SELECT * FROM songs ORDER BY title ASC")) {
						$data = array();
			
						while ($row = $result->fetch_assoc()) {
								$song_id = $row['id'];
								$title = $row['title'];
								$artist = $row['artist'];
								$lyrics = $row['lyrics'];
								$tags = $row['tags'];
				
								$data[] = array(
										'id' => $song_id,
										'title' => $title,
										'artist' => $artist,
										'lyrics' => $lyrics,
										'tags' => $tags,
								);
						}
			
						$result->close();
						return $data;
        }
        return array('status' => 'get songs error');
    }
    
    public function getSong($id) {
        if ($result = $this->db->query("SELECT * FROM songs WHERE id=\"".$id."\" LIMIT 1")) {
						while ($row = $result->fetch_assoc()) {
								$title = $row['title'];
								$artist = $row['artist'];
								$lyrics = $row['lyrics'];
								$tags = $row['tags'];
						}
			
						$data = array(
								'id' => $id,
								'title' => $title,
								'artist' => $artist,
								'lyrics' => $lyrics,
								'tags' => $tags,
						);
			
						$result->close();
						return $data;
				}
				return array('status' => 'get song error');
    }
    
    public function insertSong($title, $artist, $lyrics, $tags) {
        $sql = "INSERT INTO songs (title, artist, lyrics, tags) VALUES ('".$title."', '".$artist."', '".$lyrics."', '".$tags."')";
				if ($this->db->query($sql) === true) {
						return array('status' => 'song insert ok');
				} 
				return array('status' => 'insert error');
    }
    
    public function updateSong($id, $title, $artist, $lyrics, $tags) {
        $sql = "UPDATE songs SET title='".$title."', artist='".$artist."', lyrics='".$lyrics."', tags='".$tags."' WHERE id='".$id."';";
		
				if ($this->db->query($sql) === true) {
						return array('status' => 'song update ok');
				}
				return array('status' => 'song update error');
		}
    
	  public function getPlaylists() {
        if ($result = $this->db->query("SELECT * FROM playlists WHERE owner='".$this->tokenInfo->sub."' ORDER BY name ASC")) {
						$data = array();
			
						while ($row = $result->fetch_assoc()) {
								$playlist_id = $row['id'];
								$name = $row['name'];
								$owner = $row['owner'];
				
								$data[] = array(
										'id' => $playlist_id,
										'name' => $name,
										'owner' => $this->tokenInfo->sub
								);
						}
			
						$result->close();
						return $data;
        }       
        return array('status' => 'get playlists error');
    }
    
    public function getPlaylist($id) {
        if ($result = $this->db->query("SELECT * FROM playlists WHERE owner='".$this->tokenInfo->sub."' AND id=\"".$id."\" LIMIT 1")) {
						while ($row = $result->fetch_assoc()) {
								$name = $row['name'];
								$owner = $row['owner'];
			
						    $sql = 'SELECT songs.id, songs.title, songs.artist '.
						        'FROM playlist_song '.
						        'JOIN songs ON playlist_song.song_id=songs.id '.
						        'WHERE playlist_song.playlist_id='.$id.';';
					
				    		$songs = array();
				    
				    		if ($result2 = $this->db->query($sql)) {
						  			while ($row = $result2->fetch_assoc()) {
												$songid = $row['id'];
												$title = $row['title'];
												$artist = $row['artist'];
											
												$songs[] = array(
														'id' => $songid,
														'title' => $title,
														'artist' => $artist
												);
        						}
        				}
    			
								$data = array(
										'id' => $id,
										'name' => $name,
										'songs' => $songs,
										'owner' => $owner
								);
								return $data;
    				}
        }       
        return array('status' => 'get playlists error');
    }
    
    public function insertPlaylist($name, $songs) {
        $owner = $this->tokenInfo->sub;
        
        $sql = "INSERT INTO playlists (name, owner) VALUES ('".$name."', '".$owner."')";
				if ($this->db->query($sql) === true) {
		    		$playlistid =  $this->db->insert_id;
				
						foreach($songs as $song) {
								$songid = $this->db->real_escape_string($song['id']);
								$sqlInsertSong = "INSERT INTO playlist_song (playlist_id, song_id) VALUES ('".$playlistid."', '".$songid."')";
				
								if ($this->db->query($sqlInsertSong) === true) {
					
								}
								else {
										return array('status' => 'insert playlist error');
								}
						}
		    
						return array('status' => 'playlist insert ok');
				} 
				return array('status' => 'insert playlist error');
    }
    
    public function updatePlaylist($id, $name, $songs) {
        $owner = $this->tokenInfo->sub;
        
        $sqlUpdateName = "UPDATE playlists SET name='".$name."' WHERE id='".$id."' AND owner='".$this->tokenInfo->sub."';";
				$sqlDeleteSongs = "DELETE FROM playlist_song WHERE playlist_id = '".$id."'";
		
				if ($this->db->query($sqlUpdateName) === true && $this->db->query($sqlDeleteSongs) === true) {
				    foreach($songs as $song) {
								$songid = $this->db->real_escape_string($song['id']);
								$sqlInsertSong = "INSERT INTO playlist_song (playlist_id, song_id) VALUES ('".$id."', '".$songid."')";
				
								if ($this->db->query($sqlInsertSong) === true) {
						
								}
								else {
										return array('status' => 'update playlist error');
								}
						}
		    
						return array('status' => 'update insert ok');
				} 
				return array('status' => 'update playlist error');
    }
    
    public function removePlaylist($id) {
        // TODO: before removing, check if the request came from the playlist's author
    }

}
