<?php
class core {
    public $view;
    private $api;
    public $db;
    
    private static $instance = null;
    function __construct($once=false){
        if ($once){
            require_once 'view.php';
            $this->view = new view();
            require_once 'api.php';
            $this->api = new api();
            require_once 'database.php';
            include 'core_secrets.php';
            // $dbdata defined in 'core_secrets.php'
            $this->db = new database($dbdata);
            
        }
    }
    static public function getInstance() {
        if (null === self::$instance) {
            self::$instance = new self(true);
        }
        return self::$instance;
    }
    
    static function getUri($index=false){ // returns array of subURI or string at array index
        $arr = explode('/', $_SERVER['REQUEST_URI']);
    	return $index?$arr[$index]:$arr;
    }
    function returnHead($error){
        switch($error){
/*            case '401':
                // unauthorized
                break;
            case '403':
                // forbidden
                break;
            case '404':
                // not found
                break;
            case '410':
                // moved
                break;
*/
            default:
                header("HTTP/1.0 $error");
                exit($error);
        }
    }
    function respond(){
        count($this->getUri())>2
            ? $this->getUri()[1]==='api'
                ? $this->api->respond()
                : $this->view->render()
            : $this->view->render();
    }
}
$core = core::getInstance();
?>