<?php
    class auth extends api {
        function __construct(){
            require_once dirname(__DIR__).DIRECTORY_SEPARATOR.'Google'.DIRECTORY_SEPARATOR.'autoload.php';
        }

//----------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------        
        
        
        function login($payload){
            $core = core::getInstance();;
            // start session if not yet done
            if (session_status() == PHP_SESSION_NONE) {
                session_start();
            }
            if ($payload['email_verified']){
                $req = $core->db->fetchAll('SELECT * FROM users WHERE id=?',$payload['sub']);
                if (count($req)<=0){
                    return $this->register($payload);
                } else {
                    $user = $req[0];
                    $_SESSION['user_img']       = $user->user_img;
                    $_SESSION['usergroup']      = $user->usergroup;
                    $_SESSION['ID']             = $user->id;
                    $_SESSION['registerdate']   = date('j.n.Y',strtotime($user->registerdate));
                    return true;
                }
            } return false;
        }
        
        function register($payload){
            $core = core::getInstance();
            $stmt = 'INSERT INTO users (id, name, email, user_img, usergroup) VALUES (?,?,?,?,?)';
            $core->db->execute($stmt, $payload['sub'],$payload['name'],$payload['email'],$payload['picture'],2); // usergroup: 0 -admin; 1 - mod; 2 - user
            return true;
        }
//----------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------         
        /*function sanitize(){
            $user = isset($_GET['user']) && !empty($_GET['user'])?$_GET['user']:'';
            $secret = isset($_GET['user']) && !empty($_GET['secret'])?$_GET['secret']:'';
            $secret_ = isset($_GET['new']) && !empty($_GET['new'])?$_GET['new']:'';
        
            $user = trim($user);
            $secret = trim($secret);
            $secret_ = trim($secret_);
            
            $this->user = filter_var($user, FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_LOW);
            $this->secret = filter_var($secret, FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_LOW);
            $this->secret_ = filter_var($secret_, FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_LOW);
        } */
        function logout(){
            // start session if not yet done
            if (session_status() == PHP_SESSION_NONE) {
                session_start();
            }
            // delete login data
            $_SESSION['ID'] = '';
            return 'done';
        }
        
//------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------

        function checkToken(){
            // start session if not yet done
            if (session_status() == PHP_SESSION_NONE) {
                session_start();
            }
            
            require 'oauth_secrets.php';
            $token = isset($_GET['s']) && !empty($_GET['s'])?$_GET['s']:'';
            $token = trim($token);
            $token = filter_var($token, FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_LOW);
            
            try {
                // $client var is specified in 'oauth_secrets.php'
                $ticket = $client->verifyIdToken($token);
                if ($ticket) {
                    $data = $ticket->getAttributes();
                    $payload= $data['payload']; // user payload
                    return(array('ID' => $payload['sub'], 'registered' => $this->login($payload),'usergroup' =>$_SESSION['usergroup'], 'registerdate' =>$_SESSION['registerdate'],'user_img'=>$payload['picture']));
                }
                return false;
            } catch (Exception $e){
                return false;
            }
        }
    }
?>