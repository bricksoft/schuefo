function showInfo(){
    $.getJSON('/json/messages/info.json',
        function (data) {
            bootbox.dialog(data);
        }
    );
}
function showThirdparty(){
    $.getJSON('/json/messages/using.json',
        function (data) {
            v = '';
            data.foreach(function(entry){
                if (entry.title !== "")
                v+= '<p><b>Name:</b> '+entry.title+'</b></p>'+
                    '<p><b>Von:</b> '+entry.author+'</p>'+
                    '<p><b>Beschreibung:</b> '+entry.description+'</p>'+
                    '<p><b>Quelle:</b> <a href="'+entry.source+'" target="_blank">'+entry.title+'</a></p>'+
                    '<hr><br>';
            });
            bootbox.dialog({
                "message": v,
                "title": "Genutzte Fremdsoftware",
                "buttons": {
                    "close": {
                        "label": "Schließen",
                        "className": "btn-success",
                        "callback": null
                    }
                }
            }).find("div.modal-content").addClass("big");
        }
    );
}
function showImpressum(){
    $.getJSON('/json/messages/impressum.json',
        function (data) {
            bootbox.dialog(data);
        }
    );
}
function showDatenschutz(){
    $.getJSON('/json/messages/datenschutz.json',
        function (data) {
            bootbox.dialog(data);
        }
    );
}

function setForumData(theme_field,post_field){
    $.when($.get('/api/content/'+$(theme_field).data('forum')))//, $.get('/api/map/'))
       .done(function(result){
            $(theme_field).html(setThemes(result.response[0]));
            $(post_field).html(setPosts(result.response[1]));
        });
}
function setThemes(data){
    str = "";
    if(typeof data === 'undefined'){
        str = '<span id="x" data-forum="'+field+'" data-toggle-onclick="getThemes">sorry, aber hier ist leider kein Inhalt verfügbar!</span>';
    } else if (data == []) {
        str = '<span id="x" data-forum="'+field+'" data-toggle-onclick="getThemes">sorry, aber hier ist leider kein Inhalt verfügbar!</span>';
    } else {
        data.foreach(function(entry){
            if (entry.title !== ""){
                str += '<tr>'+
                    '<td width="1%"><img src="'+entry.author.user_img+'"></img></td>'+
                    '<td><b>Thema:</b> <a href="'+entry.link+'">'+entry.topic_name+'</a><br/>'+
                    '<b>Von:</b> '+entry.author.name+'<br/>'+
                    '<b>Beschreibung:</b> '+entry.description+'<br/>'+
                    //'<b>Quelle:</b> '+entry.title+'</a>'+
                    '</td></tr>'; 
            }
        });    
    }
    return str;
}
function setPosts(data){
    str = "";
    if(typeof data === 'undefined'){
        str = '<span id="x" data-forum="'+field+'" data-toggle-onclick="getThemes">sorry, aber hier ist leider kein Inhalt verfügbar!</span>';
    } else if (data == []) {
        str = '<span id="x" data-forum="'+field+'" data-toggle-onclick="getThemes">sorry, aber hier ist leider kein Inhalt verfügbar!</span>';
    } else {
        data.foreach(function(entry){
            if (entry.title !== ""){
                str += '<tr>'+
                    '<td width="1%"><img src="'+entry.author.user_img+'"></img></td>'+
                    '<td><b>Thema:</b> <a href="'+entry.link+'">'+entry.topic+'</a><br/>'+
                    '<b>Von:</b> '+entry.author.name+'<br/>'+
                    '<b>Beschreibung:</b> '+entry.description+'<br/>'+
                    //'<b>Quelle:</b> '+entry.title+'</a>'+
                    '</td></tr>'; 
            }
        });    
    }
   return str;
}
function setBreadcrumb(field){
     $.get('/api/breadcrumbs', function(data){
        $(field).html(data.response);
    });
}

// --------------------------------------
setBreadcrumb('#bc');
$.getScript('/assets/user.js');

// callback for init user
function init(profile){
    addUserMenu();
    setForumData('#themen_list','#posts_list');
}