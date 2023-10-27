<?php
$pagename = str_replace(array('/', '.php'), '', parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
$pagename = $pagename ? $pagename : 'default';
$pagename = (isset($thisPageName)) ? $thisPageName : $pagename;


switch ($pagename) {
	case '':
		if(empty($titlepage)) $titlepage = '';
		if(empty($desPage)) $desPage = '';
		if(empty($keyPage)) $keyPage = '';
	break;
	default:
	if(empty($titlepage)) $titlepage = '';
	if(empty($desPage)) $desPage = '';
	if(empty($keyPage)) $keyPage = '';
}