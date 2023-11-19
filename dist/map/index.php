<?php
$thisPageName = 'map';
$path = realpath(dirname(__FILE__) . '') . "/../";
include_once($path . 'app_config.php');
include($path . 'libs/head.php');
?>
<link href="<?php echo APP_ASSETS; ?>css/page/map.min.css" rel="stylesheet">
</head>

<body id="map" class="map">
    <?php include($path . 'libs/header.php'); ?>

    <main>
        <div class="map__sec">
            <div class="base">
                <a href="<?php echo APP_ASSETS; ?>/../../" class="btn">BACK TO HOME</a>
            </div>
        </div>
        <div class="txt__contents__sec">
            <div class="base txt__contents--box">
                <h2 class="ttl">OUR<br class="lg md">LOCATION</h2>
                <div class="txt__item">
                    <h3 class="ttl">99 King Street</h3>
                    <p class="txt">Newport<br>RI 02840<br>United States of America</p>
                    <p class="txt">Our newly opened gallery is located near the Edward King House on 99 King Street, theModern Art Gallery is free to all visitors and open seven days a week from 8am to 9pm.</p>
                </div>
            </div>
        </div>
    </main>

    <?php include($path . 'libs/footer.php'); ?>
    <?php include($path . 'libs/svg.php'); ?>
</body>

</html>