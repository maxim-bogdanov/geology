<?
  function url(){
    return sprintf(
      "%s://%s%s",
      isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != 'off' ? 'https' : 'http',
      $_SERVER['SERVER_NAME'],
      preg_replace( '/\/(htdocs|www)/', '', dirname($_SERVER['SCRIPT_NAME']) )
    );
  }

  function api($method, $fields) {
    $url = base_url("/api/v1" . $method);
    $fields_string = http_build_query($fields);

    //open connection
    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $fields_string);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    // curl_setopt($ch, CURLOPT_HEADER, 0);

    $response = curl_exec($ch);
    curl_close($ch);

    return json_decode($response);
  }

  function isVK(){
    return testUserAgent('vkShare'); // Mozilla/5.0 (compatible; vkShare; +http://vk.com/dev/Share)
  }
  function isOK(){
    return testUserAgent('OdklBot|odnoklassniki.ru'); // Mozilla/5.0 (compatible; OdklBot/1.0 like Linux; klass@odnoklassniki.ru)
  }
  function isFB(){
    return testUserAgent('facebookexternalhit'); // facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)
  }
  function isTwitter(){
    return testUserAgent('Twitterbot') && !isTg(); // Twitterbot/1.0
  }
  function isTg(){
    return testUserAgent('TelegramBot'); // TelegramBot (like TwitterBot)
  }
  function isWhatsApp(){
    return testUserAgent('WhatsApp'); // WhatsApp/2.19.258 A
  }
  function isViber(){
    return testUserAgent('Viber'); // Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) QtWebEngine/5.6.0 Chrome/45.0.2454.101 Safari/537.36 Viber
  }
  function testUserAgent($str) {
    return stripos($_SERVER['HTTP_USER_AGENT'], $str) !== FALSE;
  }

  function request_url() {
    return sprintf(
      "%s://%s%s",
      isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != 'off' ? 'https' : 'http',
      $_SERVER['SERVER_NAME'],
      htmlspecialchars($_SERVER['REQUEST_URI'])
    );
  }
  function base_url($val) {
    return url() . $val;
  }

  function getShare(){
    $result = new stdClass();
    $result->title = 'Перцы';
    $result->description = 'digital production studio';
    $result->image = array(
      'fb' => 'https://via.placeholder.com/1200x630.png?text=1200%20x%20630',
      'ok' => 'https://via.placeholder.com/1200x630.png?text=1200%20x%20630',
      'vk' => 'https://via.placeholder.com/510x228.png?text=510%20x%20228'
    );
    $result->canonical_url = request_url();

  	// Проверка _GET параметров и подмена текста и картинок

    if (isVK() || isViber()) {
      $result->title = $result->title . ' ' . $result->description;
    }
    return $result;
  }

  $share = getShare();
?>
