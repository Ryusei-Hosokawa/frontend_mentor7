// JavaScript Document

$(function () {
  // go top
  var topBtn = $('.pageTop');
  topBtn.hide();
  $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
      topBtn.fadeIn();
    } else {
      topBtn.fadeOut();
    }
  });
  topBtn.click(function () {
    $('body,html').animate({
      scrollTop: 0
    }, 350);
    return false;
  });

  // Gナビ
  $('.nav-toggle').click(function () {
    $(this).toggleClass('opened');
    $('#gnav').toggleClass("active");
  });
  $('#gnav ul.navi li a').click(function () {
    $('.nav-toggle').toggleClass("opened");
    $('#gnav').toggleClass("active");
  });

  //スムーススクロール
  var headerHight = $('header').outerHeight();
  $('a[href^="#"]' + 'a:not(.non-scroll)').click(function () {
    var href = $(this).attr("href");
    var target = $(href == "#" || href == "" ? 'html' : href);
    var position = target.offset().top - headerHight;
    $("html, body").animate({ scrollTop: position }, 800, "swing");
    return false;
  });
});