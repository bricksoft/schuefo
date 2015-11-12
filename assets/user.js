// automatic run script
$(function(){
    var profile;
    renderButton('login-btn-persistant');
    addUserMenu();
});

function showLogin(){
    $.getJSON('/json/messages/login.json',
        function (data) {
            data.message = "<p>Wir setzen auf Google und benutzen dies auch für deine Anmeldung.</p>" + data.message;
            if (typeof profile === 'undefined') {
                data.message += "<script>renderButton('login-btn');</script>";
            } else {
                data.message += "<button class=\"btn btn-danger btn-lg\" onclick=\"signOut();\">Ausloggen</button>";
            }
            bootbox.dialog(data);
        }
    );
}

function showUser(){
    css='.media{/*box-shadow:0px 0px 4px -2px #000;*/margin: 20px 0;padding:30px;}'+
        '.dp{border:10px solid #eee;transition: all 0.2s ease-in-out;}'+
        '.dp:hover{border:2px solid #eee;transform:rotate(360deg);-ms-transform:rotate(360deg);'+
        '-webkit-transform:rotate(360deg);/*-webkit-font-smoothing:antialiased;*/}';
    
    html='<div class="row"> <div class="col-lg-5"> <div class="media"> <a class="pull-left" href="https://plus.google.com/'+profile.hg+'" target="_blank"> <img class="media-object dp img-circle" '+
    'src="'+profile.Ei+'" '+
    'style="width: 100px;height:100px;"> </a> <div class="media-body"> <hr style="margin:8px auto">'+
    '<h4 class="media-heading">'+
    profile.zt+' <small> '+
    profile.po+'</small></h4> <h5>'+
    '<a href="https://plus.google.com/'+profile.hg+'" target="_blank">Google Profil</a></h5> <hr style="margin:8px auto"> <span class="label label-default">'+
    'Registriert seit: '+profile.date+'</span> '+
    '<span class="label label-default">Benutzergruppe: '+getUserGroup(profile.group)+'</div></div></div></div>';
    
    v='<style>'+css+'</style>'+html;

    
    
    
    /*
    v = '<p><b>Name:</b> '+profile.ye+
        '</b></p><p><b>ID:</b> '+profile.wc+
        '</p><p><b>eMail:</b> '+profile.Ld+
        '</p><p><b>Gruppe:</b> '+getUserGroup(profile.group)+
        '</p><hr><br>';
    */
    
    bootbox.dialog({
        "message": v,
        "title": "Benutzerinformation",
        "buttons": {
            "close": {
                "label": "Schließen",
                "className": "btn-success",
                "callback": null
            }
        }
    });
}

function getUserGroup(index){
    x = 'Gast';
    switch (index) {
        case '0':
            x='Admin';
            break;
        case '1':
            x='Moderator';
            break;
        case '2':
            x='Benutzer';
            break;
        case '3':
            x='Gast';
            break;
    }
    return x;
}
// --------------------------------------

function setUsername(name){
    $("#username").html((typeof name !== 'undefined' ? name:'Benutzer')+'<span class="caret"></span>');
}
function addUserMenu(){
    $.getJSON('/api/session/usermenu/',
        function(menu){
            $('#usermenu').html('');
            menu.response.foreach(function(elem){
                if (elem !== null){
                    $('#usermenu').append('<li><a href="#" onclick=\''+elem[0]+'\'>'+elem[1]+'</a></li>');
                }
            });
        }
    );
}


// --------------------------------------
function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        
        $.getJSON( "/api/session/logout/",
        function(data){
            data = data.respons;
            location.href = "/";
            
        });
    });
  }
function renderButton(id) {
      gapi.signin2.render(id, {
        'scope': 'profile email',
        'width': 200,
        'height': 50,
        'longtitle': true,
        'theme': 'light',
        'onsuccess': onSuccess,
        'onfailure': null
      });
    }
function onSuccess(googleUser) {
    // Useful data for your client-side scripts:
    profile = googleUser.getBasicProfile();
    auth = googleUser.getAuthResponse();
    setUsername(profile.getName());
    
    $.getJSON( "/api/session/status/", { 's': auth.id_token } ,
    function(data){
        data = data.response;
        if (!data.registered){
            location.reload();
        }
        addUserMenu();
        bootbox.hideAll();
        profile.group = data.usergroup;
        profile.date = data.registerdate;
        init(profile);
    });
}