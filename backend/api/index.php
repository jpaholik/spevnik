<?php
  ini_set('display_errors', 1);
	ini_set('display_startup_errors', 1);
	error_reporting(E_ALL);
  
  // In case one is using PHP 5.4's built-in server
  $filename = __DIR__ . preg_replace('#(\?.*)$#', '', $_SERVER['REQUEST_URI']);
  if (php_sapi_name() === 'cli-server' && is_file($filename)) {
      return false;
  }

  if( !function_exists('apache_request_headers') ) {

    function apache_request_headers() {
      $arh = array();
      $rx_http = '/\AHTTP_/';
      foreach($_SERVER as $key => $val) {
        if( preg_match($rx_http, $key) ) {
          $arh_key = preg_replace($rx_http, '', $key);
          $rx_matches = array();
          // do some nasty string manipulations to restore the original letter case
          // this should work in most cases
          $rx_matches = explode('_', $arh_key);
          if( count($rx_matches) > 0 and strlen($arh_key) > 2 ) {
            foreach($rx_matches as $ak_key => $ak_val) $rx_matches[$ak_key] = ucfirst($ak_val);
            $arh_key = implode('-', $rx_matches);
          }
          $arh[ucfirst(strtolower($arh_key))] = $val;
        }
      }
      return( $arh );
    }
  }


  // Require composer autoloader
  require __DIR__ . '/vendor/autoload.php';

  // Read .env
  try {
    $dotenv = new Dotenv\Dotenv(__DIR__);
    $dotenv->load();
  } catch(InvalidArgumentException $ex) {
    // Ignore if no dotenv
  }

  $app = new \App\Main();

  // Create Router instance
  $router = new \Bramus\Router\Router();

  // Activate CORS
  function sendCorsHeaders() {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: Authorization, Content-Type");
    header("Access-Control-Allow-Methods: GET,HEAD,PUT,PATCH,POST,DELETE");
  }

  $router->options('/.*', function() {
      sendCorsHeaders();
  });

  sendCorsHeaders();

  // Check JWT on /secured routes
  $router->before('GET', '/private/.*', function() use ($app) {

    $requestHeaders = apache_request_headers();

    if (!isset($requestHeaders['authorization']) && !isset($requestHeaders['Authorization'])) {
        header('HTTP/1.0 401 Unauthorized');
        echo "No token provided.";
        exit();
    }

    $authorizationHeader = isset($requestHeaders['authorization']) ? $requestHeaders['authorization'] : $requestHeaders['Authorization'];

    if ($authorizationHeader == null) {
      header('HTTP/1.0 401 Unauthorized');
      echo "No authorization header sent";
      exit();
    }

    $authorizationHeader = str_replace('bearer ', '', $authorizationHeader);
    $token = str_replace('Bearer ', '', $authorizationHeader);

    try {
        $app->setCurrentToken($token);
    }
    catch(\Auth0\SDK\Exception\CoreException $e) {
      header('HTTP/1.0 401 Unauthorized');
      echo $e;
      exit();
    }

  });
  
  // Check JWT on /secured routes
  $router->before('POST', '/private/.*', function() use ($app) {

    $requestHeaders = apache_request_headers();

    if (!isset($requestHeaders['authorization']) && !isset($requestHeaders['Authorization'])) {
        header('HTTP/1.0 401 Unauthorized');
        echo "No token provided.";
        exit();
    }

    $authorizationHeader = isset($requestHeaders['authorization']) ? $requestHeaders['authorization'] : $requestHeaders['Authorization'];

    if ($authorizationHeader == null) {
      header('HTTP/1.0 401 Unauthorized');
      echo "No authorization header sent";
      exit();
    }

    $authorizationHeader = str_replace('bearer ', '', $authorizationHeader);
    $token = str_replace('Bearer ', '', $authorizationHeader);

    try {
        $app->setCurrentToken($token);
    }
    catch(\Auth0\SDK\Exception\CoreException $e) {
      header('HTTP/1.0 401 Unauthorized');
      echo $e;
      exit();
    }

  });
  $app->dbConnect();

  $router->get('/public/ping', function() use ($app){
      echo json_encode($app->publicPing());
  });

  $router->get('/private/ping', function() use ($app){
      echo json_encode($app->privatePing());
  });
  
  /**
   * Spevnik app API
   */
  // Songs
  $router->get('/public/get/songs', function() use ($app){
    echo json_encode($app->getSongs());
  });
  
  $router->post('/public/get/song', function() use ($app){
    $data = json_decode(file_get_contents('php://input'), true);
    $id = $app->db->real_escape_string($data['id']);
    
    echo json_encode($app->getSong($id));
  });
  
  $router->post('/private/insert/song', function() use ($app){
    $data = json_decode(file_get_contents('php://input'), true);
    $title = $app->db->real_escape_string($data['title']);
    $artist = $app->db->real_escape_string($data['artist']);
    $lyrics = $app->db->real_escape_string($data['lyrics']);
    $tags = $app->db->real_escape_string($data['tags']);
    
    echo json_encode($app->insertSong($title, $artist, $lyrics, $tags));
  });
  
  $router->post('/private/update/song', function() use ($app){
    $data = json_decode(file_get_contents('php://input'), true);
    $id = $app->db->real_escape_string($data['id']);
    $title = $app->db->real_escape_string($data['title']);
    $artist = $app->db->real_escape_string($data['artist']);
    $lyrics = $app->db->real_escape_string($data['lyrics']);
    $tags = $app->db->real_escape_string($data['tags']);
    
    echo json_encode($app->updateSong($id, $title, $artist, $lyrics, $tags));
  });
  
  // Playlists
  $router->get('/private/get/playlists', function() use ($app){
      echo json_encode($app->getPlaylists());
  });
  
  $router->post('/private/get/playlist', function() use ($app){
      $data = json_decode(file_get_contents('php://input'), true);
      $id = $app->db->real_escape_string($data['id']);
    
      echo json_encode($app->getPlaylist($id));
  });
  
  $router->post('/private/insert/playlist', function() use ($app){
      $data = json_decode(file_get_contents('php://input'), true);
      $name = $app->db->real_escape_string($data['name']);
      if(isset($data['songIds'])) {
        $songs = $data['songIds'];
      }
      else {
        $songs = array();
      }
      
      echo json_encode($app->insertPlaylist($name, $songs));
  });
  
  $router->post('/private/update/playlist', function() use ($app){
      $data = json_decode(file_get_contents('php://input'), true);
      $id = $app->db->real_escape_string($data['id']);
      $name = $app->db->real_escape_string($data['name']);
      if(isset($data['songIds'])) {
        $songs = $data['songIds'];
      }
      else {
        $songs = array();
      }
      
      echo json_encode($app->updatePlaylist($id, $name, $songs));
  });
  
  // Others
  $router->set404(function() {
    header('HTTP/1.1 404 Not Found');
    echo "Page not found";
  });

  // Run the Router
  $router->run();
