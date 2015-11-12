$.getScript('/assets/hotkeys.js', function () {
    
    $(document).bind('keydown', 'alt+L', function(){
        showLogin();
    }); 


});