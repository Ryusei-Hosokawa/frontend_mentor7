<?php
	// get protocol.
	$protocol = empty($_SERVER["HTTPS"]) ? 'http://' : 'https://';
	// get host.
	$APP_URL = $protocol.$_SERVER['HTTP_HOST'].'/';
	define('APP_URL', $APP_URL);
	define('APP_ASSETS', APP_URL.'assets/');
	define('APP_PATH', dirname(__FILE__).'/');
	define('APP_PATH_WP', dirname(__FILE__).'/wp/');
	define('IE8_FLAG', false);
	$google_tag_manager = '';
	define('GOOGLE_TAG_MANAGER', $google_tag_manager);
?>
