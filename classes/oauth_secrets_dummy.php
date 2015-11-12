<?php

$clientid = 'XXXXXXXXX.apps.googleusercontent.com';
$client = new Google_Client();
$client->setClientId($clientid);
$client->setClientSecret('XXXXXXXXXX');
$client->setRedirectUri('');
$client->setScopes('email profile');
?>