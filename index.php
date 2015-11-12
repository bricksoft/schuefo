<?php
require __DIR__.DIRECTORY_SEPARATOR.'classes'.DIRECTORY_SEPARATOR.'core.php';
if (isset($_GET['e'])?!empty($_GET['e']):false){
    // error vorhanden \ $e ist gesetzt
    $core->returnHead($_GET['e']);
} elseif (isset($_GET['j'])?!empty($_GET['j']):false) {
    // special respond
    // TODO implement special response scenario handler
} else $core->respond();
?>