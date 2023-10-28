<?php
$thisPageName = 'top';
$path = realpath(dirname(__FILE__) . '') . "/";
include_once($path . 'app_config.php');
include($path . 'libs/head.php');
?>
<link href="<?php echo APP_ASSETS; ?>css/page/top.min.css" rel="stylesheet">
</head>

<body id="top" class="top">
    <?php include($path . 'libs/header.php'); ?>

    <main>
        
    </main>

    <?php include($path . 'libs/footer.php'); ?>
    <?php include($path . 'libs/svg.php'); ?>
</body>

</html>