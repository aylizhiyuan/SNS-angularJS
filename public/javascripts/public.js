/**
 * Created by hama on 2017/5/11.
 */
//公共的JS
$(function(){
    positionFooter();
    function positionFooter() {
        //如果页面内容高度小于屏幕高度，div#footer将绝对定位到屏幕底部，否则div#footer保留它的正常静态定位
        var top = ($('.aw-top-menu-wrap').height() + $('.main').height()) + 'px';
        if( $('#all').height() > $(window).height()) {
            $(".footer").removeClass('short').addClass('long').css({top:top});
        }
    }
    $(window).scroll(positionFooter).resize(positionFooter);
})

