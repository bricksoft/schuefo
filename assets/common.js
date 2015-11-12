
// prototype methods extending JS
Array.prototype.foreach = function (callback){
    for (var i = 0;i<this.length;i++){
        callback(this[i]);
    }
};
String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};
String.prototype.replaceAll = function (find, replace) {
    var str = this;
    return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
};
// --------------------------------------


    $.loadCSS =function (url){
        if($('head').size()>0){
            if (document.createStyleSheet){
                document.createStyleSheet(url);
            } else {
                $("head").append($("<link rel='stylesheet' href='"+url+"' type='text/css'/>"));
            }
        }
    };
    $.getLang =function (){
        var browserlangArray = window.navigator.languages || [window.navigator.language || window.navigator.userLanguage];
        var browserlang = browserlangArray[0];
        var realbrowserlang = browserlang.length>2?browserlang.substring(0,2):browserlang;
        return realbrowserlang;
        
    };
    $.async =function (f, c) {
        setTimeout(function() {
            f();
            if (c) {c();}
        }, 0);
    };