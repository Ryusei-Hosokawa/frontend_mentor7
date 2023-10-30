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
        <div class="sect__fv">
            <div class="base">
                <div class="contents__cover">
                    <h1 class="ttl">
                        MODERN <br>
                        ART GALLERY
                    </h1>
                    <div class="txt__cover">
                        <p class="txt">
                            The arts in the collection of the Modern Art Gallery all started from a spark of
                            inspiration. Will these pieces inspire you? Visit us and find out.
                        </p>
                        <a href="#" class="btn">
                            OUR LOCATION
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <?php include($path . 'libs/footer.php'); ?>
    <?php include($path . 'libs/svg.php'); ?>
</body>

</html>