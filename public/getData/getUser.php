<?php
    include_once '../functions.php';
    include_once '../config.php';

    $DB = mysqli_connect(Config::$DB_LOCAL, Config::$DB_LOGIN, Config::$DB_PASS, Config::$DB_NAME);
    mysqli_set_charset($DB,'utf8');


    if (isset($_GET['getUser'], $_GET['user'], $_GET['pass']) && $_GET['user'] && $_GET['pass']){
        $query = query("
            SELECT * FROM `users`
            WHERE 
              `nick` = '".mres($_GET['user'])."'
              AND `pass` = '".mres($_GET['pass'])."'
              AND `access` > 0
              LIMIT 0,1
        ");
        
        if (mysqli_num_rows($query)){
            $row = mysqli_fetch_assoc($query);
            echo json_encode($row);
        } else {
            echo '{"error" : "0"}';
        }
    }