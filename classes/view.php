<?php
class view extends core {
    private $template_dir;
    
    function __construct(){
        $this->template_dir = dirname(__DIR__).DIRECTORY_SEPARATOR.'templates'.DIRECTORY_SEPARATOR;
    }
    
    private function getFile($file){
        ob_start();
        include($this->template_dir.$file);
        $output = ob_get_contents();
        ob_end_clean();
        return $output;
    }

    private function replaceTags($txt){
        $txt= str_replace('{$uri$}',parent::getURI(1),$txt);
    	return $txt;
    }
    
    public function render(){
        echo $this->replaceTags(
            $template = $this->getFile('head.txt')
                .$this->getFile('content.txt')
                .$this->getFile('body.txt')
        );
    }
}
?>