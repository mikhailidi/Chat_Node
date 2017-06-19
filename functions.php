<?php
    function pr($var) {
        echo '<pre>';
        print_r($var);
        echo '</pre>';
    }
    
    function query($var){
        global  $DB;
        $debug = debug_backtrace();
        $query = mysqli_query($DB, $var);
        if ($query === false){
            $error =
                mysqli_error($DB).'<br>
                    FILE NAME: '.$debug[0]['file'].'<br>
                    TIME: '.date("Y-m-d H:i:s").'<br>
                    LINE: '.$debug[0]['line'].'<br>
                    FUNCTION: '.$debug[0]['function'].'<br>
                    ARGUMENT: '.$debug[0]['args'][0].'
                ';
            file_put_contents('./logs/mysqli.log', strip_tags($error)."\n\n", FILE_APPEND);
            echo $error;
            exit();
        } else {
            return $query;
        }
    }
    
    function mres($var){
        global $DB;
        $var = urldecode($var);
        $res = mysqli_real_escape_string($DB, $var);
        return $res;
    }
    
    function activePage($var){
        if(mp_isset($var) && $_GET['page'] == $var){
            echo 'active';
        }
    }
    
    function isEmpty($var, $symbol = 'brak') {
        if(!$var) {
            echo $symbol;
        } else {
            echo htmlspecialchars($var);
        }
    }
    
    
    function trimAll($var){
        if (!is_array($var)){
            $var = trimAll($var);
        }else{
            $var = array_map('trimAll', $var);
        }
        return $var;
    }
    
    function mp_isset($var) {
        if (isset($var) && !empty($var)){
            return 1;
        } else {
            return 0;
        }
    }