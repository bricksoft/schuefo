function loadScript(url, callback)
{
    script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    
    script.onreadystatechange = callback;
    script.onload = callback;
    
    document.getElementsByTagName('head')[0].appendChild(script);
}

loadScript("/assets/jquery.js", function(){
    $.getScript( "/assets/common.js", function(){
        $.when(
            $.loadCSS('assets/bootstrap.css'),
            $.loadCSS('assets/main.css'),
            $.getScript( "/assets/bootstrap.js"),
            $.getScript( "/assets/bootbox.js"),
            $.getScript( "https://apis.google.com/js/platform.js"),
            $.getScript( "/assets/site.js"),
            $.Deferred(function( deferred ){
                $( deferred.resolve );
            })
        ).done(function(){
            console.log('loaded.');
            $(function() {
                $('body').addClass('loaded');
                $('h1').css('color','#222222');
            });
        });
    });
});