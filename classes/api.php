<?php
    class api extends core {
        private $auth;
        private $debug;
        function __construct(){
            require 'auth.php';
            require 'content.php';
            $this->auth = new auth();
            $this->content = new content();
            $this->debug = false;
        }
        function respond(){
            if ($this->debug){
                error_reporting(E_ALL);
                ini_set('display_errors', 1);
            }
            
            $uri = parent::getURI();
            array_shift($uri);
            $obj = new stdClass();
            $obj->response = new stdClass();
            
            // start session if not yet done
            if (session_status() == PHP_SESSION_NONE) {
                session_start();
            }
            switch ($uri[1]){
                // session URI
                case 'session':
                    switch ($uri[2]){
                        case 'usermenu':
                           $obj->response = array(
                                                    !empty($_SESSION['ID'])?['showUser();','Benutzerinformation']:null,
                                                    ['showLogin()',!empty($_SESSION['ID'])?'Logout':'Login']
                                                );
                            
                            break;
                        case 'status':
                            $obj->response = $this->auth->checkToken();
                            break;
                        case 'logout':
                            $obj->response = $this->auth->logout();
                            break;
                        default: 
                            $obj->response = 'wrong request';
                    } break;

                
                case 'content':
                    $obj->response = $this->content->get();
                    break;
                    
                
                case 'breadcrumbs':
                    $obj->response = $this->breadcrumbs('','Home',array('<li>','</li>'));
                    break;
                
                
                case 'map':
                    // API MAP
                    $obj->response = new map();
                    if (isset($uri[2])){
                        switch ($uri[2]) {
                            case '1':
                                //return treemap
                                var_dump($obj->response);
                                return;
                                break;
                        
                            case '2':
                                ini_set('xdebug.var_display_max_depth',6);
                                var_dump($obj->response);
                                return;
                                break;
                        }
                    } break;
                    
                    
                // non responded URI -> ERROR
                default:
                    $obj->response = 'wrong request';    
                }
                
            // dispatch API
            // set json header as main content header
            if (!$this->debug){
                header('Content-Type: application/json');
            }
            // output json
            $x = json_encode($obj);
            echo $x;
        }
        
        function breadcrumbs($separator = ' &raquo; ', $home = 'Home', $surrounding = array('<li>','</li>')) {
            $path = array_filter(explode('/', parse_url($_SERVER['HTTP_REFERER'], PHP_URL_PATH)));
            $base = ($_SERVER['HTTPS'] ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'] . '/';
            
            $breadcrumbs = Array($surrounding[0]."<a href=\"$base\">$home</a>".$surrounding[1]);
            $last = end(array_keys($path));
            
            foreach ($path AS $x => $crumb) {
                $title = ucwords(str_replace(Array('.php', '_'), Array('', ' '), $crumb));
                if ($x != $last){
                    $breadcrumbs[] = $surrounding[0]."<a href=\"$base$crumb\">$title</a>".$surrounding[1];
                } else {
                    $breadcrumbs[] = $surrounding[0].$title.$surrounding[1];
                }
            }       
            
            return implode($separator, $breadcrumbs);
        }
    }
    
    class map {
        public $api;
        function __construct(){
            $this->api= [   
                            ["session"=>
                                [
                                    ["status"],
                                    ["usermenu"]
                                ]
                            ],
                            [""=>
                                [
                                    [],
                                    []
                                ]
                            ]
                        ];
        }
    }
?>