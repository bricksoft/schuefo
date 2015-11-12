<?php
class content extends core {
    function get(){
        $core = core::getInstance();
        $uri = $_SERVER['REQUEST_URI'];
        $prefix = '/api/content/';

        if (substr($uri, 0, strlen($prefix)) == $prefix) {
            $uri = substr($uri, strlen($prefix));
        } 
        $uri != $uri ? '': $uri;
        $uri_parts = explode('/',$this->secure($uri));
        $entry = $uri_parts[0];
        
        $limit = 100;
        
        $limit = ($limit >= 1 ? ' LIMIT '.$limit : ' LIMIT 100');
        
        if(strlen($entry)<=0){
    
            $stmt = 'SELECT * FROM topics WHERE topic_pid=?'.$limit;
            $req = $core->db->fetchAll($stmt,0);
            $topics = $this->getContent_DB($req);
    
        } else {
            
            $stmt = 'SELECT * FROM topics WHERE link=?'.$limit;
            $req = $core->db->fetchAll($stmt,(strlen($entry)>0?$entry:null));
            
            $pid = $req[0]->topic_id;
            
            $stmt = 'SELECT * FROM topics WHERE topic_pid=?'.$limit;
            $req = $core->db->fetchAll($stmt,$pid);
            
            $topics = $this->getContent_DB($req);
            
            
            
        } 
        
        
        
        $entries = array();
        $limit = ($limit >= 1 ? ' LIMIT '.$limit : ' LIMIT 100');
        
      
        $stmt = 'SELECT * FROM entries WHERE topic_id=?'.$limit;
        $stmt_filter = 'SELECT * FROM topics WHERE link=?';
        
        $filter = $core->db->fetchAll($stmt_filter,$entry);
        if (isset($filter[0])){
            if (isset($filter[0]->topic_id)){
                $entries = $core->db->fetchAll($stmt,$filter[0]->topic_id);
                $entries = $this->getContent_DB($entries);
            }
        }

        $this->utf8_encode_deep($topics);
        $this->utf8_encode_deep($entries);
        
        return array($topics,$entries);  
    }
    
    
    function getContent_DB($req){
        $core = core::getInstance();
        $topics = array();
        foreach ($req as $v){
            $v->author = $core->db->fetchAll('SELECT * FROM users WHERE id=? LIMIT 1',$v->author)[0];
            
            $t  =   isset($v->topic_name)   ? $v->topic_name : isset($v->topic) ? $v->topic : "";
            $t2 =   isset($v->text)         ? $v->text       : isset($v->text)  ? $v->text  : "";
        

            $v->topic = utf8_encode($t);
            $v->author->name = utf8_encode($v->author->name);
            $v->author->email = utf8_encode($v->author->email);
            $v->description = utf8_encode($v->description);
            $v->text = utf8_encode($t2);
            
            if ($_SESSION['usergroup'] <= $v->ual){
                $topics[] = $v;                            
            }
        }
        return $topics;
    }
    
    
    private function secure ($v){
        $v = isset($v) && !empty($v)?$v:'';
        $v = trim($v);
        $v = filter_var($v, FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_LOW);
        $v = utf8_encode($v);
        return $v;
    }
    
    function utf8_encode_deep(&$input) {
	    if (is_string($input)) {
    		$input = utf8_encode($input);
	    } else if (is_array($input)) {
		    foreach ($input as &$value) {
		    	$this->utf8_encode_deep($value);
	    	}
		
	    	unset($value);
	    } else if (is_object($input)) {
	    	$vars = array_keys(get_object_vars($input));
		
	    	foreach ($vars as $var) {
			    $this->utf8_encode_deep($input->$var);
		    }
	    }
    }
    
}
?>