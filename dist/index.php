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

        <div class="sect__seco">
            <div class="base">
                <div class="contents__cover first">
                    <article class="txts__item white">
                        <h2 class="ttl">
                            Your Day <br class="md sm">at <br class="lg">
                            the <br class="md">Gallery
                        </h2>
                        <p class="txt">
                            Wander through our distinct collections and find new insights about our artists. Dive into
                            the details of their creative process.
                        </p>
                    </article>
                    <figure class="img__cover img01">
                        <picture>
                            <source srcset='<?php echo APP_ASSETS; ?>img/top/img02_sp.jpg.webp' type='image/webp'
                                media='(max-width:750px)'>
                            <source srcset='<?php echo APP_ASSETS; ?>img/top/img02_sp.jpg' media='(max-width:750px)'>
                            <source srcset='<?php echo APP_ASSETS; ?>img/top/img02_tb.jpg.webp' type='image/webp'
                                media='(max-width:1150px)'>
                            <source srcset='<?php echo APP_ASSETS; ?>img/top/img02_tb.jpg' media='(max-width:1150px)'>
                            <source srcset='<?php echo APP_ASSETS; ?>img/top/img02.jpg.webp' type='image/webp'>
                            <img src='<?php echo APP_ASSETS; ?>img/top/img02.jpg' alt=''>
                        </picture>
                    </figure>
                </div>
                <div class="contents__cover">
                    <figure class="img__cover img02">
                        <picture>
                            <source srcset='<?php echo APP_ASSETS; ?>img/top/img03_sp.jpg.webp' type='image/webp'
                                media='(max-width:750px)'>
                            <source srcset='<?php echo APP_ASSETS; ?>img/top/img03_sp.jpg' media='(max-width:750px)'>
                            <source srcset='<?php echo APP_ASSETS; ?>img/top/img03_tb.jpg.webp' type='image/webp'
                                media='(max-width:1150px)'>
                            <source srcset='<?php echo APP_ASSETS; ?>img/top/img03_tb.jpg' media='(max-width:1150px)'>
                            <source srcset='<?php echo APP_ASSETS; ?>img/top/img03.jpg.webp' type='image/webp'>
                            <img src='<?php echo APP_ASSETS; ?>img/top/img03.jpg' alt=''>
                        </picture>
                    </figure>
                    <div class="img__and__txts__item">
                        <figure class="img__cover img03">
                            <picture>
                                <source srcset='<?php echo APP_ASSETS; ?>img/top/img04_sp.jpg.webp' type='image/webp'
                                    media='(max-width:750px)'>
                                <source srcset='<?php echo APP_ASSETS; ?>img/top/img04_sp.jpg'
                                    media='(max-width:750px)'>
                                <source srcset='<?php echo APP_ASSETS; ?>img/top/img04_tb.jpg.webp' type='image/webp'
                                    media='(max-width:1150px)'>
                                <source srcset='<?php echo APP_ASSETS; ?>img/top/img04_tb.jpg'
                                    media='(max-width:1150px)'>
                                <source srcset='<?php echo APP_ASSETS; ?>img/top/img04.jpg.webp' type='image/webp'>
                                <img src='<?php echo APP_ASSETS; ?>img/top/img04.jpg' alt=''>
                            </picture>
                        </figure>
                        <article class="txts__item black">
                            <h2 class="ttl">
                                COME & BE <br>
                                INSPIRED
                            </h2>
                            <p class="txt">
                                We’re excited to welcome you to our gallery and see how our collections influence you.
                            </p>
                        </article>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <?php include($path . 'libs/footer.php'); ?>
    <?php include($path . 'libs/svg.php'); ?>
</body>

</html>