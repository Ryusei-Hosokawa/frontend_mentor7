<footer>
    <div class="base">
        <div class="footer__contents">
            <h2 class="ttl">
                MODERN <br>
                ART GALLERY
            </h2>
            <p class="txt">
                The Modern Art Gallery is free to all visitors and open seven days a week from 8am to 9pm. Find us at 99
                King Street, Newport, USA.
            </p>
            <div class="icon__cover">
                <a href="#" class="icon facebook"></a>
                <a href="#" class="icon instagram"></a>
                <a href="#" class="icon twitter"></a>
            </div>
        </div>
    </div>
</footer>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
<script src="<?php echo APP_ASSETS; ?>js/modernizr.js"></script>
<script src="<?php echo APP_ASSETS; ?>js/common.min.js"></script>

<script>
    var ua = navigator.userAgent
    var sp = (ua.indexOf('iPhone') > 0 || ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0)
    if (sp) new ViewportExtra(375)
</script>